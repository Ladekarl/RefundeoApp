import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';

export default class OverviewScreen extends Component {

    static navigationOptions = {
        tabBarLabel: 'Oversigt',
        tabBarIcon: ({tintColor}) => (
            <Icon name='home' style={{fontSize: 20, height: undefined, width: undefined, color: tintColor}}/>),
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
    }
});