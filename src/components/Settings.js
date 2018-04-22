import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';

export default class SettingsScreen extends Component {

    static navigationOptions = {
        title: strings('settings.settings'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text>Settings Works</Text>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    }
});
