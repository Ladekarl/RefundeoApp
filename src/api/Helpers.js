import {strings} from '../shared/i18n';
import LocalStorage from '../storage';
import Location from '../shared/Location';
import geolib from 'geolib';
import NetworkConnection from '../shared/NetworkConnection';

export const API_URL = 'https://app.refundeo.com';
//export const API_URL = 'http://localhost:5000';
//export const API_URL = 'https://refundeodev.azurewebsites.net';

export default class Helpers {
    static termsOfServiceVersion = 1;
    static privacyPolicyVersion = 1;

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
            if (error.errors) {
                throw Helpers.getRegisterError(error);
            } else if (error.error) {
                throw Helpers.getLoginError(error);
            } else {
                throw strings('login.unknown_error');
            }
        }
        Helpers.handleResponse(response);
    }

    static getLoginError(response) {
        switch (response.error) {
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

    static getRegisterError(response) {
        for (let error of response.errors)
            switch (error.code) {
                case 'InvalidUserName':
                    return strings('register.invalid_username');
                case 'DuplicateUserName':
                    return strings('register.duplicate_username');
                case 'PasswordTooShort':
                    return strings('register.password_too_short');
                case 'PasswordRequiresNonAlphanumeric':
                    return strings('register.password_non_alpha');
                case 'PasswordRequiresDigit':
                    return strings('register.password_digit');
                case 'PasswordRequiresLower':
                    return strings('register.password_lower');
                case 'PasswordRequiresUpper':
                    return strings('register.password_upper');
                case 'PasswordMismatch':
                    return strings('register.password_mismatch');
                case 'PasswordRequiresUniqueChars':
                    return strings('register.password_not_unique');
                default:
                    return strings('register.unknown_error');
            }
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
            if (!user.privacyPolicyVersion || user.acceptedPrivacyPolicy && user.privacyPolicyVersion && user.privacyPolicyVersion !== Helpers.privacyPolicyVersion) {
                user.acceptedPrivacyPolicy = false;
            }
            if (!user.termsOfServiceVersion || user.acceptedTermsOfService && user.termsOfServiceVersion && user.termsOfServiceVersion !== Helpers.termsOfServiceVersion) {
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
            if(merchant.latitude && merchant.longitude) {
                merchant.distance = geolib.getDistance(location.coords, {
                    latitude: merchant.latitude,
                    longitude: merchant.longitude
                }, 100);
                if (merchant.distance) {
                    merchantsWithDistance.push(merchant);
                }
            }
        });
        merchantsWithDistance.sort((a, b) => {
            return a.distance - b.distance;
        });
        return merchantsWithDistance;
    }
}