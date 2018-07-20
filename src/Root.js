import React, {Component} from 'react';
import {AppNavigator} from './navigation/AppNavigator';
import {View, StyleSheet, NetInfo, Text, Dimensions, Platform} from 'react-native';
import colors from './shared/colors';
import NetworkConnection from './shared/NetworkConnection';
import {strings} from './shared/i18n';

const {width} = Dimensions.get('window');

export default class Root extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true
        };
    }

    componentDidMount() {
        NetInfo.isConnected.fetch().then(this.handleConnectivityChange);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        NetworkConnection.registerHandler();
    }

    componentWillUnmount() {
        NetworkConnection.removeHandler();
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({isConnected});
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.content, {marginTop: this.state.isConnected ? 0 : Platform.OS === 'ios' ?  20 : 30}]}>
                    <AppNavigator/>
                </View>
                {!this.state.isConnected &&
                <View style={styles.offlineContainer}>
                    <Text style={styles.offlineText}>{strings('root.no_connection')}</Text>
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColor,
        flex: 1
    },
    content: {
        flex: 1
    },
    offlineContainer: {
        backgroundColor: colors.activeTabColor,
        height: Platform.OS === 'ios' ? 35 : 30,
        justifyContent: 'center',
        alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        top: 0
    },
    offlineText: {
        color: colors.backgroundColor
    }
});

