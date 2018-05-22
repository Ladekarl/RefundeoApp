import Helpers, {API_URL} from './Helpers';
import LocalStorage from '../storage';
import RNFetchBlob from 'react-native-fetch-blob';
import Guid from '../shared/Guid';

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

        return await Helpers.saveUser(user);
    }

    static async getUser() {
        const requestOptions = {
            method: 'GET',
            headers: await Helpers.authHeader(),
        };

        const savedUser = await LocalStorage.getUser();

        const response = await Helpers.fetchAuthenticated(`${API_URL}/api/user/account/${encodeURIComponent(savedUser.id)}`, requestOptions);

        const user = await response.json();

        return await Helpers.updateUser(user);
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

        return await Helpers.updateUser(user);
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

        return await Helpers.fetchAuthenticated(`${API_URL}/api/account/ChangePassword`, requestOptions);
    }

    static async getRefundCases() {
        const requestOptions = {
            method: 'GET',
            headers: await Helpers.authHeader()
        };

        const response = await Helpers.fetchAuthenticated(`${API_URL}/api/user/refundcase`, requestOptions);

        const refundCases = await response.json();

        refundCases.sort((a, b) => {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        });

        return refundCases;
    }

    static async uploadDocumentation(refundCase, documentation) {
        RNFetchBlob.config({fileCache: true, appendExt: 'jpg'});
        const fs = RNFetchBlob.fs;
        const base64 = await fs.readFile(documentation, 'base64');

        const requestOptions = {
            method: 'POST',
            headers: {
                ...await Helpers.authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ImageName: Guid(),
                Image: base64,
                ImageType: 'image/jpg'
            })
        };

        const requestUrl = `${API_URL}/api/user/refundcase/${refundCase.id}/doc`;
        return await fetch(requestUrl, requestOptions);
    }

    static async requestRefund(refundCase) {
        const requestOptions = {
            method: 'POST',
            headers: {
                ...await Helpers.authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isRequested: true
            })
        };

        return await Helpers.fetchAuthenticated(`${API_URL}/api/user/refundcase/${refundCase.id}/request`, requestOptions);
    }

    static async claimRefundCase(refundCaseId) {
        const requestOptions = {
            method: 'GET',
            headers: {
                ...await Helpers.authHeader(),
            }
        };

        return await Helpers.fetchAuthenticated(`${API_URL}/api/user/refundcase/${refundCaseId}/claim`, requestOptions);
    }
}