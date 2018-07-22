import {strings} from '../shared/i18n';
import LocalStorage from '../storage';
import Location from '../shared/Location';
import geolib from 'geolib';
import NetworkConnection from '../shared/NetworkConnection';

export const API_URL = 'https://app.refundeo.com';
//export const API_URL = 'http://192.168.1.104:5000';
//export const API_URL = 'http://refundeodev.azurewebsites.net';

export default class Helpers {
    static termsOfService = strings('register.terms_of_service');
    static privacyPolicy = strings('register.privacy_policy');

    static async authHeader() {
        let user = await LocalStorage.getUser();

        if (user && user.token) {
            return {'Authorization': 'Bearer ' + user.token};
        } else {
            return {};
        }
    }

    static handleResponse(response) {
        if (!response.ok) {
            throw response;
        }
    }

    static async handleLoginResponse(response) {
        if (response.status === 400) {
            const error = await response.json();
            switch (error.error) {
                case -1:
                    throw strings('login.wrong_password');
                case -2:
                    throw strings('login.user_does_not_exist');
                case -3:
                    throw strings('login.missing_password');
                case -4:
                    throw strings('login.missing_username');
                default:
                    throw strings('login.unknown_error');
            }
        }
        Helpers.handleResponse(response);
    }

    static async handleRegisterResponse(response) {
        if (response.status === 400) {
            const respObj = await response.json();
            for (let error of respObj.errors)
                switch (error.code) {
                    case 'InvalidUserName':
                        throw strings('register.invalid_username');
                    case 'DuplicateUserName':
                        throw strings('register.duplicate_username');
                    case 'PasswordTooShort':
                        throw strings('register.password_too_short');
                    case 'PasswordRequiresNonAlphanumeric':
                        throw strings('register.password_non_alpha');
                    case 'PasswordRequiresDigit':
                        throw strings('register.password_digit');
                    case 'PasswordRequiresLower':
                        throw strings('register.password_lower');
                    case 'PasswordRequiresUpper':
                        throw strings('register.password_upper');
                    case 'PasswordMismatch':
                        throw strings('register.password_mismatch');
                    default:
                        throw strings('register.unknown_error');

                }
        }
        Helpers.handleResponse(response);
    }

    static async fetch(request, requestOptions) {
        const isConnected = await NetworkConnection.getConnection();
        if (isConnected) {
            return await fetch(request, requestOptions);
        } else {
            throw {noNetwork: true};
        }
    }

    static async fetchAuthenticated(request, requestOptions) {
        const response = await Helpers.fetch(request, requestOptions);
        return await Helpers.handleAuthenticatedResponse(request, requestOptions, response);
    }

    static async handleRefundCasesResponse(refundCases) {
        if (refundCases) {
            refundCases.sort((a, b) => {
                return new Date(b.dateCreated) - new Date(a.dateCreated);
            });
            refundCases.forEach(async r => await this.handleRefundCaseByIdResponse(r));
            await LocalStorage.saveRefundCases(refundCases);
        } else {
            refundCases = await LocalStorage.getRefundCases();
        }
        return refundCases;
    }

    static async handleRefundCaseByIdResponse(refundCase) {
        if (refundCase && !refundCase.isRequested) {
            if (!refundCase.vatFormImage) {
                refundCase.tempVatFormImage = await LocalStorage.getVatFormImage(refundCase.id);
            }
            if (!refundCase.receiptImage) {
                refundCase.tempReceiptImage = await LocalStorage.getReceiptImage(refundCase.id);
            }
        }
        return refundCase;
    }

    static async handleMerchantsResponse(merchants) {
        if (merchants) {
            merchants = await this.setMerchantDistances(merchants);
            await LocalStorage.saveMerchants(merchants.slice(0, merchants.length > 100 ? 100 : merchants.length));
        } else {
            merchants = await LocalStorage.getMerchants();
        }
        return merchants;
    }

    static async handleTagsResponse(tags) {
        if (tags) {
            await LocalStorage.saveTags(tags);
        } else {
            tags = await LocalStorage.getTags();
        }
        return tags;
    }

    static async handleAuthenticatedResponse(request, requestOptions, response) {
        // If response is 401 attempt to gain new token from refresh token
        if (response.status === 401 || response.status === 403) {
            const user = await LocalStorage.getUser();
            if (user.refreshToken) {
                await Helpers.getTokenFromRefreshToken(user.refreshToken, response);
                // Perform request again with new token
                requestOptions.headers = {
                    ...requestOptions.headers,
                    ...await Helpers.authHeader()
                };
                response = await Helpers.fetch(request, requestOptions);
            } else {
                throw response;
            }
        }
        Helpers.handleResponse(response);
        return response;
    }

    static async saveUser(user) {
        if (user && user.token && user.roles && user.roles.indexOf('User') > -1) {
            if (!user.privacyPolicy || user.acceptedPrivacyPolicy && user.privacyPolicy && user.privacyPolicy.localeCompare(Helpers.privacyPolicy) !== 0) {
                user.acceptedPrivacyPolicy = false;
            }
            if (!user.termsOfService || user.acceptedTermsOfService && user.termsOfService && user.termsOfService.localeCompare(Helpers.termsOfService) !== 0) {
                user.acceptedTermsOfService = false;
            }
            user.isMerchant = false;
        } else if (user.roles.indexOf('Merchant') > -1 || user.roles.indexOf('AttachedMerchant' > -1)) {
            user.isMerchant = true;
        } else {
            throw user;
        }
        await LocalStorage.setUser(user);
        return user;
    }

    static async updateUser(newUser) {
        let user;
        try {
            user = await LocalStorage.getUser();
        } catch (error) {
            user = {};
        }
        const updatedUser = {
            ...user,
            ...newUser
        };
        return this.saveUser(updatedUser);
    }

    static async getTokenFromRefreshToken(refreshToken, originalResponse) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                grantType: 'refresh_token',
                refreshToken,
                scopes: ['offline_access']
            })
        };

        const response = await Helpers.fetch(`${API_URL}/Token`, requestOptions);

        if (!response.ok) {
            throw originalResponse;
        }

        const user = await response.json();

        return Helpers.saveUser(user);
    }

    static async setMerchantDistances(merchants) {
        const location = await Location.getCurrentPosition();
        let merchantsWithDistance = [];
        merchants.forEach((merchant) => {
            merchant.distance = geolib.getDistance(location.coords, {
                latitude: merchant.latitude,
                longitude: merchant.longitude
            }, 100);
            if (merchant.distance) {
                merchantsWithDistance.push(merchant);
            }
        });
        merchantsWithDistance.sort((a, b) => {
            return a.distance - b.distance;
        });
        return merchantsWithDistance;
    }
}