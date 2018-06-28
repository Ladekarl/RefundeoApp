import Helpers, {API_URL} from './Helpers';
import LocalStorage from '../storage';

export default class Api {
    static async getTokenFacebook(accessToken) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({accessToken, scopes: ['offline_access']})
        };

        const response = await Helpers.fetch(`${API_URL}/Token/Facebook`, requestOptions);

        Helpers.handleResponse(response);

        const user = await response.json();

        await Helpers.saveUser(user);

        return user;
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

        const response = await Helpers.fetch(`${API_URL}/Token`, requestOptions);

        await Helpers.handleLoginResponse(response);

        const user = await response.json();

        await Helpers.saveUser(user);

        return user;
    }

    static async register(username, password, email, acceptedTermsOfService, termsOfService, acceptedPrivacyPolicy, privacyPolicy) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                password,
                email,
                acceptedTermsOfService,
                termsOfService,
                acceptedPrivacyPolicy,
                privacyPolicy,
                scopes: ['offline_access']
            })
        };

        const response = await Helpers.fetch(`${API_URL}/api/user/account`, requestOptions);

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

    static async getUserById(id) {
        const requestOptions = {
            method: 'GET',
            headers: await Helpers.authHeader(),
        };

        const response = await Helpers.fetchAuthenticated(`${API_URL}/api/user/account/${encodeURIComponent(id)}`, requestOptions);

        return await response.json();
    }

    static async updateUser(user) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                ...await Helpers.authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...user
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

        return await Helpers.handleRefundCasesResponse(refundCases);
    }

    static async getRefundCaseById(refundCaseId) {
        const requestOptions = {
            method: 'GET',
            headers: await Helpers.authHeader()
        };

        const response = await Helpers.fetchAuthenticated(`${API_URL}/api/user/refundcase/${refundCaseId}`, requestOptions);

        return await response.json();
    }

    static async uploadDocumentation(refundCase, vatForm, receipt) {
        const requestOptions = {
            method: 'POST',
            headers: {
                ...await Helpers.authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                receiptImage: receipt,
                receiptImageType: 'image/png',
                vatFormImage: vatForm,
                vatFormImageType: 'image/png'
            })
        };

        const requestUrl = `${API_URL}/api/user/refundcase/${refundCase.id}/doc`;
        await Helpers.fetchAuthenticated(requestUrl, requestOptions);
        await LocalStorage.removeVatFormImage(refundCase.id);
        await LocalStorage.removeReceiptImage(refundCase.id);
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

    static async postRefundCase(customerId, receiptNumber, amount, customerSignature, merchantSignature) {
        const requestOptions = {
            method: 'POST',
            headers: {
                ...await Helpers.authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount,
                qrCodeHeight: 200,
                qrCodeWidth: 200,
                qrCodeMargin: 5,
                receiptNumber,
                customerId,
                customerSignature,
                merchantSignature
            })
        };

        return await Helpers.fetchAuthenticated(`${API_URL}/api/merchant/refundcase`, requestOptions);
    }

    static async getAllMerchants() {
        const requestOptions = {
            method: 'GET',
            headers: {
                ...await Helpers.authHeader()
            }
        };

        const response = await Helpers.fetchAuthenticated(`${API_URL}/api/merchant/account`, requestOptions);

        const merchants = await response.json();

        return await Helpers.setMerchantDistances(merchants);
    }

    static async postEmail(refundCase, email) {
        const requestOptions = {
            method: 'POST',
            headers: {
                ...await Helpers.authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        };

        return await Helpers.fetchAuthenticated(`${API_URL}/api/user/refundcase/${refundCase.id}/email`, requestOptions);
    }
}