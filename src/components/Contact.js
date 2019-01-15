import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import Icon from 'react-native-fa-icons';
import CustomText from '../components/CustomText';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-navigation';

export default class Contact extends PureComponent {

    static navigationOptions = {
        title: strings('help.contact'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topContainer}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={require('../../assets/refundeo_banner_top_small.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.sectionHeaderTopContainer}>
                        <CustomText style={styles.sectionHeaderText}>{strings('help.support')}</CustomText>
                    </View>
                    <View style={styles.rowContainer}>
                        <Icon name='phone' style={styles.leftText}/>
                        <CustomText style={styles.rightText}>(+45) 89 88 14 90</CustomText>
                    </View>
                    <View style={styles.rowContainer}>
                        <Icon name='envelope' style={styles.leftText}/>
                        <CustomText style={styles.rightText}>contact@refundeo.com</CustomText>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor
    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomContainer: {
        flex: 0.8,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    sectionHeaderTopContainer: {
        backgroundColor: colors.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 15
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    image: {
        flex: 1,
        height: 150,
        width: 150,
    },
    leftText: {
        color: colors.darkTextColor,
        fontSize: 20,
        marginLeft: 20,
        marginRight: 10,
        alignSelf: 'stretch',
    },
    rightText: {
        marginLeft: 20,
        marginRight: 10,
        fontSize: 15,
        color: colors.backgroundColor
    },
    sectionHeaderText: {
        fontSize: 18,
        marginLeft: 10,
        textAlign: 'center'
    }
});