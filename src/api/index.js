import Helpers, {API_URL} from './Helpers';
import LocalStorage from '../storage';

export default class Api {
    static async getTokenFacebook(accessToken) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({accessToken, scopes: ['offline_access']})
        };

        const response = await fetch(`${API_URL}/Token/Facebook`, requestOptions);

        Helpers.handleResponse(response);

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

        await Helpers.handleLoginResponse(response);

        const user = await response.json();

        return Helpers.saveUser(user);
    }

    static async register(username, password, acceptedTermsOfService, termsOfService, acceptedPrivacyPolicy, privacyPolicy) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                password,
                acceptedTermsOfService,
                termsOfService,
                acceptedPrivacyPolicy,
                privacyPolicy,
                scopes: ['offline_access']
            })
        };

        const response = await fetch(`${API_URL}/api/user/account`, requestOptions);

        await Helpers.handleRegisterResponse(response);

        const user = await response.json();

        return Helpers.saveUser(user);
    }

    static async getUser() {
        const requestOptions = {
            method: 'GET',
            headers: await Helpers.authHeader(),
        };

        const savedUser = await LocalStorage.getUser();

        const response = await Helpers.fetchAuthenticated(`${API_URL}/api/user/account/${encodeURIComponent(savedUser.id)}`, requestOptions);

        const user = await response.json();

        return Helpers.updateUser(user);
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
                bankAccountNumber: user.bankAccountNumber,
                acceptedPrivacyPolicy: user.acceptedPrivacyPolicy,
                privacyPolicy: user.privacyPolicy,
                acceptedTermsOfService: user.acceptedTermsOfService,
                termsOfService: user.termsOfService
            })
        };

        await Helpers.fetchAuthenticated(`${API_URL}/api/user/account`, requestOptions);

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

        await Helpers.fetchAuthenticated(`${API_URL}/api/account/ChangePassword`, requestOptions);
    }

    static async getRefundCases() {
        const requestOptions = {
            method: 'GET',
            headers: await Helpers.authHeader()
        };

        const response = await Helpers.fetchAuthenticated(`${API_URL}/api/user/refundcase`, requestOptions);

        return await response.json();
    }
}