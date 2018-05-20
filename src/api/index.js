import Helpers from './helpers';
import LocalStorage from '../storage';

const API_URL = 'https://refundeo20180331121625.azurewebsites.net';

export default class Api {
    static async getTokenFacebook(accessToken) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({accessToken, scopes: ['offline_access']})
        };

        const response = await fetch(`${API_URL}/Token/Facebook`, requestOptions);

        if (!response.ok) {
            throw response.statusText;
        }

        const user = await response.json();

        return Helpers.saveUser(user);
    }

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

        await Helpers.checkLoginResponse(response);

        if (!response.ok) {
            throw response.statusText;
        }

        const user = await response.json();

        return Helpers.saveUser(user);
    }


    static async register(username, password) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                password,
                scopes: ['offline_access']
            })
        };

        const response = await fetch(`${API_URL}/api/user/account`, requestOptions);

        await Helpers.checkRegisterResponse(response);

        if (!response.ok) {
            throw response.statusText;
        }

        const user = await response.json();

        return Helpers.saveUser(user);
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

        const response = await fetch(`${API_URL}/Token/Facebook`, requestOptions);

        if (!response.ok) {
            throw response.statusText;
        }

        const user = await response.json();

        return Helpers.saveUser(user);
    }

    static async getUser() {
        const requestOptions = {
            method: 'GET',
            headers: await Helpers.authHeader(),
        };

        const savedUser = await LocalStorage.getUser();

        const response = await fetch(`${API_URL}/api/user/account/${encodeURIComponent(savedUser.id)}`, requestOptions);

        if (!response.ok) {
            throw response;
        }

        const user = await response.json();

        return Helpers.updateUser(user)
    }

    static async updateUser(user) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                ...await Helpers.authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                country: user.country,
                bankRegNumber: user.bankRegNumber,
                bankAccountNumber: user.bankAccountNumber
            })
        };

        const response = await fetch(`${API_URL}/api/user/account`, requestOptions);

        if (!response.ok) {
            throw response;
        }

        return Helpers.updateUser(user);
    }

    static async changePassword(oldPassword, newPassword, passwordConfirmation) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                ...await Helpers.authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldPassword,
                newPassword,
                passwordConfirmation
            })
        };

        const response = await fetch(`${API_URL}/api/account/ChangePassword`, requestOptions);

        if (!response.ok) {
            throw response;
        }
    }

    static async getRefundCases() {
        const requestOptions = {
            method: 'GET',
            headers: await Helpers.authHeader()
        };

        const response = await fetch(`${API_URL}/api/user/refundcase`, requestOptions);

        if (!response.ok) {
            throw response.statusText;
        }

        return await response.json();
    }
}