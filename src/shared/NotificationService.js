import {NOTIFICATION_SENDER_ID} from 'react-native-dotenv';
import {Platform, Alert} from 'react-native';

let NotificationHub = null;
if (Platform.OS === 'ios') {
    NotificationHub = require('react-native-azurenotificationhub/index.ios');
} else {
    NotificationHub = require('react-native-azurenotificationhub');
}

let remoteNotificationsDeviceToken = '';

let hubOptions = {
    connectionString: 'Endpoint=sb://refundeo.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=ZcRf0Yc/05rRa5EIpOVG14EGTVFBii/T2KJZiiV+9SU=', // The Notification Hub connection string
    hubName: 'refundeo',          // The Notification Hub name
    senderID: NOTIFICATION_SENDER_ID,         // The Sender ID from the Cloud Messaging tab of the Firebase console
    //tags: ['test']           // The set of tags to subscribe to
};

export default class NotificationService {

    static async _requestPermissions() {
        NotificationHub.addEventListener('register', NotificationService._onRegistered);
        NotificationHub.addEventListener('registrationError', NotificationService._onRegistrationError);
        NotificationHub.addEventListener('registerAzureNotificationHub', NotificationService._onAzureNotificationHubRegistered);
        NotificationHub.addEventListener('azureNotificationHubRegistrationError', NotificationService._onAzureNotificationHubRegistrationError);
        NotificationHub.addEventListener('notification', NotificationService._onRemoteNotification);
        NotificationHub.addEventListener('localNotification', NotificationService._onLocalNotification);
        return NotificationHub.requestPermissions();
    }

    static async register() {
        try {
            if (Platform.OS === 'ios') {
                await this._requestPermissions();
                if (remoteNotificationsDeviceToken) {
                    return NotificationHub.register(remoteNotificationsDeviceToken, hubOptions);
                }
            } else {
                return NotificationHub.register(hubOptions);
            }
        } catch (error) {
            throw error;
        }
    }

    static unregister() {
        return NotificationHub.unregister();
    }

    static _onRegistered(deviceToken) {
        remoteNotificationsDeviceToken = deviceToken;
        Alert.alert(
            'Registered For Remote Push',
            `Device Token: ${deviceToken}`,
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }

    static _onRegistrationError(error) {
        Alert.alert(
            'Failed To Register For Remote Push',
            `Error (${error.code}): ${error.message}`,
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }

    static _onRemoteNotification(notification) {
        Alert.alert(
            'Push Notification Received',
            'Alert message: ' + notification.getMessage(),
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }

    static _onAzureNotificationHubRegistered(registrationInfo) {
        Alert.alert('Registered For Azure notification hub',
            'Registered For Azure notification hub',
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }

    static _onAzureNotificationHubRegistrationError(error) {
        Alert.alert(
            'Failed To Register For Azure Notification Hub',
            `Error (${error.code}): ${error.message}`,
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }

    static _onLocalNotification(notification) {
        Alert.alert(
            'Local Notification Received',
            'Alert message: ' + notification.getMessage(),
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }
}