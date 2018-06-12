import React, {Component} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import {strings} from '../shared/i18n';
import Icon from 'react-native-fa-icons';

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
                        {strings('overview.welcome_text')}
                    </Text>
                </View>
                <View style={styles.middleContainer}>
                    <TouchableOpacity style={styles.logoButtonContainer} onPress={this.navigateScanner}>
                        <Icon style={styles.logoButton} name='camera'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.buttonText}>
                        {strings('overview.no_refunds_text')}
                    </Text>
                    <Text style={styles.buttonText}>
                        {strings('overview.get_started_text')}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 10
    },
    logoButtonContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
        alignSelf: 'center',
        backgroundColor: colors.slightlyDarkerColor,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderRadius: 200,
        zIndex: 0,
        elevation: 10
    },
    logoButton: {
        fontSize: 45,
        zIndex: 9999,
        color: colors.activeTabColor,
        margin: 30
    },
    welcomeText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.activeTabColor
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        margin: 5,
        color: colors.activeTabColor
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

