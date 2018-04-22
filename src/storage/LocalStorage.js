import {AsyncStorage} from 'react-native';
import {TOKEN_STORAGE_KEY, USER_STORAGE_KEY} from 'react-native-dotenv';

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
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            return error;
        }
    }

    static async removeUser() {
        try {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
        } catch (error) {
            return error;
        }
    }

    static async setToken(token) {
        try {
            await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
        } catch (error) {
            return error;
        }
    }

    static async getToken() {
        try {
            let tokenJson = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
            return await JSON.parse(tokenJson) || null;
        } catch (error) {
            return error;
        }
    }
}