import LocalStorage from '../storage';
import firebase from 'react-native-firebase';
import type {RemoteMessage} from 'react-native-firebase';

export default class NotificationService {

    static topicName;
    static messageListener;

    static async register() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            await this.subscribeToTopic();
        } else {
            let permitted = await this.requestPermission();
            if (permitted) {
                await this.subscribeToTopic();
            }
        }
    }

    static registerReceiver() {
        this.messageListener = firebase.messaging().onMessage(this._handleMessage);
    }

    static _handleMessage(message: RemoteMessage) {
        console.log(JSON.stringify(message));
    }

    static unregister() {
        if (this.topicName) {
            firebase.messaging().unsubscribeFromTopic(this.topicName);
        }
        this.topicName = undefined;
    }

    static async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            return true;
        } catch (error) {
            return false;
        }
    }

    static async subscribeToTopic() {
        const user = await LocalStorage.getUser();
        if (user && user.id) {
            this.topicName = user.id.replace(/-/g, '');
            firebase.messaging().subscribeToTopic(this.topicName);
            this.registerReceiver();
        }
    }
}