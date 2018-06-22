import React, {PureComponent} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';

export default class EmptyStoreList extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.centerText}>
                    {strings('stores.empty')}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerText: {
        color: colors.activeTabColor,
        textAlign: 'center',
        fontSize: 20
    }
});