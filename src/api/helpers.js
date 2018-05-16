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
                    throw strings('login.missing_username')
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
}