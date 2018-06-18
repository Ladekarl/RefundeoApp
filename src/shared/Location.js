import Permissions from 'react-native-permissions';

export default class Location {
    static async getCurrentPosition() {
        const response = await Permissions.check('location');
        if (response === 'authorized') {
            return await this._getCurrentPositionWrapper();
        } else {
            await this.requestPermission();
            return await this._getCurrentPositionWrapper();
        }
    }

    static async requestPermission() {
        const response = await Permissions.request('location');
        if (response !== 'authorized') {
            throw response;
        }
    }


    static _getCurrentPositionWrapper(): Promise {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position);
            }, (error) => {
                reject(error);
            });
        });
    }
}