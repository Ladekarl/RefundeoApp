import {PermissionsAndroid, Platform} from 'react-native';
import {strings} from './i18n';

export default class Location {
    static async getCurrentPosition() {
        if (Platform.OS === 'ios') {
            return await this.getCurrentPositionWrapper();
        } else {
            const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (hasPermission) {
                return await this.getCurrentPositionWrapper();
            } else {
                await this.requestAndroidPermission();
                return await this.getCurrentPositionWrapper();
            }
        }
    }

    static async requestAndroidPermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                'title': strings('stores.permission_title'),
                'message': strings('stores.permission_message')
            }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            throw granted;
        }
    }


    static getCurrentPositionWrapper(): Promise {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position);
            }, (error) => {
                reject(error);
            });
        });
    }
}