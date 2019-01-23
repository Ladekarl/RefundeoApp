import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import CustomText from './CustomText';

export default class EmptyStoreList extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <CustomText style={styles.centerText}>
                    {strings('stores.empty')}
                </CustomText>
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
        color: colors.whiteColor,
        textAlign: 'center',
        fontSize: 20
    }
});