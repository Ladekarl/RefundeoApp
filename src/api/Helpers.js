import {strings} from '../shared/i18n';
import LocalStorage from '../storage';

export const API_URL = 'https://refundeo20180331121625.azurewebsites.net';

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

    static async fetchAuthenticated(request, requestOptions) {
        const response = await fetch(request, requestOptions);
        return Helpers.handleAuthenticatedResponse(request, requestOptions, response);
    }

    static async handleAuthenticatedResponse(request, requestOptions, response) {
        // If response is 401 attempt to gain new token from refresh token
        if (response.status === 401 || response.status === 403) {
            const user = await LocalStorage.getUser();
            if (user.refreshToken) {
                await Helpers.getTokenFromRefreshToken(user.refreshToken);
                // Perform request again with new token
                requestOptions.headers = {
                    ...requestOptions.headers,
                    ...await Helpers.authHeader()
                };
                response = await fetch(request, requestOptions);
            } else {
                throw response;
            }
        }
        Helpers.handleResponse(response);
        return response;
    }

    static async saveUser(user) {
        if (user && user.token && user.roles && user.roles.indexOf('User') > -1) {
            if (user.acceptedPrivacyPolicy && user.privacyPolicy != Helpers.privacyPolicy) {
                user.acceptedPrivacyPolicy = false;
            }
            if (user.acceptedTermsOfService && user.termsOfService != Helpers.termsOfService) {
                user.acceptedTermsOfService = false;
            }
            await LocalStorage.setUser(user);
        } else if (!user.roles || user.roles.indexOf('User') < 0) {
            throw strings('login.user_not_customer');
        }
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

    static async getTokenFromRefreshToken(refreshToken) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                grantType: 'refresh_token',
                refreshToken,
                scopes: ['offline_access']
            })
        };

        const response = await fetch(`${API_URL}/Token`, requestOptions);

        Helpers.handleResponse(response);

        const user = await response.json();

        return Helpers.saveUser(user);
    }
}