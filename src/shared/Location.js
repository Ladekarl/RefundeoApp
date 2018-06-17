import {PermissionsAndroid, Platform} from 'react-native';
import {strings} from './i18n';

export default class Location {
    static async getCurrentPosition(successCallback) {
        if (Platform.OS === 'ios') {
            navigator.geolocation.getCurrentPosition(successCallback);
        } else {
            const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (hasPermission) {
                navigator.geolocation.getCurrentPosition(successCallback);
            } else {
                await this.requestAndroidPermission(successCallback);
                navigator.geolocation.getCurrentPosition(successCallback);
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
}