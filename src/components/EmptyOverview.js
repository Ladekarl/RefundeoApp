import React, {Component} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';

export default class EmptyOverviewScreen extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired
    };

    navigateScanner = () => {
        this.props.actions.navigateScanner();
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.welcomeText}>
                        Velkommen til Refundeo
                    </Text>
                </View>
                <View style={styles.middleContainer}>
                    <TouchableOpacity style={styles.logoButtonContainer} onPress={this.navigateScanner}>
                        <Image style={styles.logoButton}
                               source={require('../../assets/images/refundeo_logo.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.buttonText}>
                        Du har endnu ingen refunderinger
                    </Text>
                    <Text style={styles.buttonText}>
                        Tryk på knappen og scan QR koden på din kvittering
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'space-between',
        padding: 10
    },
    logoButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: colors.slightlyDarkerColor,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderRadius: 200,
        zIndex: 0,
        elevation: 10
    },
    logoButton: {
        zIndex: 9999,
        margin: 15
    },
    welcomeText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

