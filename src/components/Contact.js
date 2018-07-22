import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import Icon from 'react-native-fa-icons';

export default class Contact extends PureComponent {

    static navigationOptions = {
        title: strings('help.contact'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Image
                        resizeMode='contain'
                        source={require('../../assets/refundeo_logo.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.sectionHeaderTopContainer}>
                        <Text style={styles.sectionHeaderText}>{strings('help.support')}</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Icon name='phone' style={styles.leftText}/>
                        <Text style={styles.rightText}>(+45) 89 88 14 90</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Icon name='envelope' style={styles.leftText}/>
                        <Text style={styles.rightText}>contact@refundeo.com</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor
    },
    topContainer: {
        padding: '10%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    bottomContainer: {
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
        color: colors.submitButtonColor
    },
    sectionHeaderText: {
        fontSize: 18,
        marginLeft: 10,
        textAlign: 'center'
    }
});