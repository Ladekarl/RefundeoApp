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
}