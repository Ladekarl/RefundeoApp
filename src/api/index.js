import LocalStorage from '../storage';
import {strings} from '../shared/i18n';

const API_URL = 'https://refundeo20180331121625.azurewebsites.net';

async function authHeader() {
    let user = await LocalStorage.getUser();

    if (user && user.token) {
        return {'Authorization': 'Bearer ' + user.token};
    } else {
        return {};
    }
}

export default class Api {
    static async getToken(username, password) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                password,
                grantType: 'password',
                scopes: ['offline_access']
            })
        };

        const response = await fetch(`${API_URL}/Token`, requestOptions);

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

        if (!response.ok) {
            throw response;
        }

        const user = await response.json();
        if (user && user.token && user.roles && user.roles.indexOf('User') > -1) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            await LocalStorage.setUser(user);
        } else if (!user.roles || user.roles.indexOf('User') < 0) {
            throw strings('login.user_not_customer');
        }
        return user;
    }

    static async RefreshToken(refreshToken) {
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

        if (!response.ok) {
            throw response.statusText;
        }

        const user = await response.json();
        if (user && user.token) {
            user.refreshToken = refreshToken;
            await LocalStorage.setUser(user);
        }

        return user;
    }
}