import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';

export default class OverviewScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        tabBarLabel: 'Oversigt',
        tabBarIcon: ({tintColor}) => (
            <Icon name='home' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Overview works!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabBarIcon: {
        fontSize: 20,
        height: undefined,
        width: undefined,
    }
});