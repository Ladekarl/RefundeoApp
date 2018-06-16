import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ImageBackground, Platform, Image} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';

export default class StoresList extends Component {

    static propTypes = {
        distance: PropTypes.number.isRequired,
        logo: PropTypes.string,
        banner: PropTypes.string,
        refundPercentage: PropTypes.number.isRequired,
        openingHours: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
    };

    render() {
        const {
            distance,
            logo,
            banner,
            refundPercentage,
            openingHours,
            name,
            onPress
        } = this.props;

        let distFirst = `${distance}`;
        let distSecond = 'm';

        if (distFirst.length === 4) {
            distFirst = distFirst.substring(0, 1) + ',' + distFirst.substring(1, 2);
            distSecond = 'km';
        } else if (distFirst.length > 4) {
            distFirst = distFirst.substring(0, 2);
            distSecond = 'km';
        }

        let bannerObj = banner ? {uri: 'data:image/png;base64,' + banner} : require('../../assets/example-store.jpg');
        let logoObj = logo ? {uri: 'data:image/png;base64,' + logo} : require('../../assets/refundeo_banner_small.png');

        let dist = distFirst + ' ' + distSecond;
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.container}
                onPress={onPress}>
                <View style={styles.cardContainer}>
                    <ImageBackground
                        style={styles.bannerImage}
                        source={bannerObj}
                        borderRadius={2}>
                        <View style={styles.bannerTextBarContainer}>
                            <View style={styles.leftContainer}>
                                <Text style={styles.leftText}>{dist}</Text>
                            </View>
                            {Platform.OS === 'ios' &&
                            <View style={styles.iconContainer}>
                                <Image style={styles.logoImage} resizeMode='contain'
                                       source={logoObj}/>
                            </View>
                            }
                            <View style={styles.rightContainer}>
                                <Text style={styles.rightText}>{'Refund: ' + refundPercentage + ' %'}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={styles.contentContainer}>
                        <View style={styles.temperatureContainer}>
                            <Text
                                style={styles.mainText}>{name}</Text>
                            <Text
                                style={styles.subText}>{openingHours}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        backgroundColor: colors.separatorColor,
        padding: 3
    },
    iconContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: colors.backgroundColor,
        borderRadius: 40,
        padding: 6,
        elevation: 1,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.separatorColor
    },
    logoImage: {
        height: 60,
        width: 60,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardContainer: {
        height: 180,
        marginBottom: 3,
        backgroundColor: colors.backgroundColor,
        borderRadius: 2,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        elevation: 1,
        borderColor: colors.separatorColor
    },
    bannerImage: {
        justifyContent: 'flex-end',
        width: '100%',
        borderRadius: 50,
        height: 120
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'visible',
        alignItems: 'center',
        width: '100%',
        height: 35,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingLeft: 10,
        paddingRight: 10
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftText: {
        fontSize: 15,
        alignSelf: 'flex-start',
        color: colors.backgroundColor,
    },
    rightText: {
        fontSize: 15,
        alignSelf: 'flex-end',
        color: colors.backgroundColor,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    temperatureContainer: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 1,
    },
    mainText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    subText: {
        fontSize: 13
    }
});