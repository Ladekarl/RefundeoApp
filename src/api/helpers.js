import {strings} from '../shared/i18n';
import LocalStorage from '../storage';

export default class Helpers {
    static async authHeader() {
        let user = await LocalStorage.getUser();

        if (user && user.token) {
            return {'Authorization': 'Bearer ' + user.token};
        } else {
            return {};
        }
    }

    static async checkLoginResponse(response) {
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
    }

    static async checkRegisterResponse(response) {
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
    }

    static async saveUser(user) {
        if (user && user.token && user.roles && user.roles.indexOf('User') > -1) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
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
        return await this.saveUser(updatedUser);
    }
}