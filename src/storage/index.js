import {AsyncStorage} from 'react-native';
// noinspection ES6CheckImport
import {USER_STORAGE_KEY} from 'react-native-dotenv';

export default class LocalStorage {

    static vatFormStorageString = 'com.refundeo.storage.vatFormImage.';
    static receiptStorageString = 'com.refundeo.storage.receiptImage.';
    static refundCasesStorageString = 'com.refundeo.storage.refundCases';


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
            return await AsyncStorage.setItem(this.vatFormStorageString + refundCaseId, JSON.stringify(image));
        } catch (error) {
            return error;
        }
    }

    static async getVatFormImage(refundCaseId) {
        try {
            let vatFormImageJson = await AsyncStorage.getItem(this.vatFormStorageString + refundCaseId);
            return await JSON.parse(vatFormImageJson) || null;
        } catch (error) {
            return error;
        }
    }

    static async removeVatFormImage(refundCaseId) {
        try {
            return await AsyncStorage.removeItem(this.vatFormStorageString + refundCaseId);
        } catch (error) {
            return error;
        }
    }

    static async saveReceiptImage(refundCaseId, image) {
        try {
            return await AsyncStorage.setItem(this.receiptStorageString + refundCaseId, JSON.stringify(image));
        } catch (error) {
            return error;
        }
    }

    static async getReceiptImage(refundCaseId) {
        try {
            let vatFormImageJson = await AsyncStorage.getItem(this.receiptStorageString + refundCaseId);
            return await JSON.parse(vatFormImageJson) || null;
        } catch (error) {
            return error;
        }
    }

    static async removeReceiptImage(refundCaseId) {
        try {
            return await AsyncStorage.removeItem(this.receiptStorageString + refundCaseId);
        } catch (error) {
            return error;
        }
    }

    static async saveRefundCases(refundCases) {
        try {
            return await AsyncStorage.setItem(this.refundCasesStorageString, JSON.stringify(refundCases));
        } catch (error) {
            return error;
        }
    }

    static async getRefundCases() {
        try {
            let refundCase = await AsyncStorage.getItem(this.refundCasesStorageString);
            return await JSON.parse(refundCase) || null;
        } catch (error) {
            return error;
        }
    }

    static async removeRefundCases() {
        try {
            return await AsyncStorage.removeItem(this.refundCasesStorageString);
        } catch (error) {
            return error;
        }
    }
}