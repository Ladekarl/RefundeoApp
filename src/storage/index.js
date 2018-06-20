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

    static async saveReceiptImage(refundCaseId, image) {
        try {
            return await AsyncStorage.setItem('com.refundeo.receiptImage.' + refundCaseId, JSON.stringify(image));
        } catch (error) {
            return error;
        }
    }

    static async getReceiptImage(refundCaseId) {
        try {
            let vatFormImageJson = await AsyncStorage.getItem('com.refundeo.receiptImage.' + refundCaseId);
            return await JSON.parse(vatFormImageJson) || null;
        } catch (error) {
            return error;
        }
    }

    static async removeReceiptImage(refundCaseId) {
        try {
            return await AsyncStorage.removeItem('com.refundeo.receiptImage.' + refundCaseId);
        } catch (error) {
            return error;
        }
    }
}