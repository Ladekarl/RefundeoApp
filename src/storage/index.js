import {AsyncStorage} from 'react-native';
// noinspection ES6CheckImport
import {USER_STORAGE_KEY} from 'react-native-dotenv';

export default class LocalStorage {

    static async getUser() {
        try {
            let userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
            return await JSON.parse(userJson) || null;
        } catch (error) {
            return error;
        }
    }

    static async setUser(user) {
        try {
            return await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            return error;
        }
    }

    static async removeUser() {
        try {
            return await AsyncStorage.removeItem(USER_STORAGE_KEY);
        } catch (error) {
            return error;
        }
    }

    static async saveVatFormImage(refundCaseId, image) {
        try {
            return await AsyncStorage.setItem('com.refundeo.vatFormImage.' + refundCaseId, JSON.stringify(image));
        } catch (error) {
            return error;
        }
    }

    static async getVatFormImage(refundCaseId) {
        try {
            let vatFormImageJson = await AsyncStorage.getItem('com.refundeo.vatFormImage.' + refundCaseId);
            return await JSON.parse(vatFormImageJson) || null;
        } catch (error) {
            return error;
        }
    }

    static async removeVatFormImage(refundCaseId) {
        try {
            return await AsyncStorage.removeItem('com.refundeo.vatFormImage.' + refundCaseId);
        } catch (error) {
            return error;
        }
    }

    static async saveRefundCases(refundCases) {
        try {
            return await AsyncStorage.setItem('com.refundeo.storage.refundCases' + refundCaseId, JSON.stringify(refundCases));
        } catch (error) {
            return error;
        }
    }

    static async getRefundCases() {
        try {
            let refundCase = await AsyncStorage.getItem('com.refundeo.storage.refundCases');
            return await JSON.parse(refundCase) || null;
        } catch (error) {
            return error;
        }
    }

    static async removeRefundCases() {
        try {
            return await AsyncStorage.removeItem('com.refundeo.storage.refundCases');
        } catch (error) {
            return error;
        }
    }
}