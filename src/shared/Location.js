import Permissions from 'react-native-permissions';
import geolib from 'geolib';

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

    static calculateDistance(distance: number): string {
        let distFirst = `${distance}`;
        let distSecond = 'm';

        if (distance >= 1000) {
            if (distance >= 10000) {
                distFirst = geolib.convertUnit('km', distance, 0);
            } else {
                distFirst = geolib.convertUnit('km', distance, 1);
            }
            distSecond = 'km';
        }

        return distFirst + ' ' + distSecond;
    }
}