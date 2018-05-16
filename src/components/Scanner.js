import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, Platform} from 'react-native';
import Icon from 'react-native-fa-icons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../shared/colors';

export default class ScannerScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        tabBarIcon: ({tintColor}) => (
            <Icon name='camera' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    constructor(props) {
        super(props);
        this.state = {
            shouldShowCamera: false
        }
    }

    onSuccess = (e) => {
        Alert.alert('QR Kode blev scannet', JSON.stringify(e.data));
    };

    qrCodeScanner;

    render() {
        return (
            <View style={styles.container}>
                <QRCodeScanner
                    ref={ref => this.qrCodeScanner = ref}
                    onRead={this.onSuccess}
                    containerStyle={styles.cameraContainer}
                    showMarker={false}
                    reactivateTimeout={2}
                    topContent={
                        <View style={styles.cameraTopContainer}>
                            <Text style={styles.centerText}>
                                Scan QR Koden på din kvittering
                            </Text>
                        </View>
                    }
                    cameraStyle={styles.cameraStyle}
                />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    centerText: {
        fontSize: 15,
    },
    cameraStyle: {
        borderRadius: 2
    },
    cameraTopContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tabBarIcon: {
        fontSize: Platform.OS === 'ios' ? 20 : 15
    }
});