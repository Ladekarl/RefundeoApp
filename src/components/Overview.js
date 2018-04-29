import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-fa-icons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../shared/colors';

export default class OverviewScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        tabBarIcon: ({tintColor}) => (
            <Icon name='home' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    constructor(props) {
        super(props);
    }

    onSuccess = (e) => {
        Alert.alert('QR Kode blev scannet', JSON.stringify(e.data));
    };

    reactivate = () => {
        this.qrCodeScanner.reactivate();
    };

    qrCodeScanner;

    render() {
        return (
            <QRCodeScanner
                ref={ref => this.qrCodeScanner = ref}
                onRead={this.onSuccess}
                containerStyle={styles.container}
                showMarker={false}
                topContent={
                    <Text style={styles.centerText}>
                        Scan QR Koden på din kvittering
                    </Text>
                }
                cameraStyle={styles.cameraStyle}
                bottomContent={
                    <TouchableOpacity style={styles.buttonTouchable} onPress={this.reactivate}>
                        <Text style={styles.buttonText}>Reactivate</Text>
                    </TouchableOpacity>
                }
            ><Text>
                Hej
            </Text></QRCodeScanner>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColor
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32
    },
    buttonText: {
        fontSize: 21,
        color: colors.submitButtonColor
    },
    buttonTouchable: {
        padding: 16,
    },
    cameraStyle: {
        borderRadius: 20,
        padding: 20
    }
});