import Helpers from './helpers';

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