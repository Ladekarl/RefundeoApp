import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import geolib from 'geolib';
import {strings} from '../shared/i18n';
import CustomText from './CustomText';
import FastImage from 'react-native-fast-image';

export default class StoreListItem extends PureComponent {

    static propTypes = {
        distance: PropTypes.number.isRequired,
        logo: PropTypes.string.isRequired,
        banner: PropTypes.string.isRequired,
        refundPercentage: PropTypes.number,
        openingHours: PropTypes.array.isRequired,
        name: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
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

        if (distance >= 1000) {
            if (distance >= 10000) {
                distFirst = geolib.convertUnit('km', distance, 0);
            } else {
                distFirst = geolib.convertUnit('km', distance, 1);
            }
            distSecond = 'km';
        }

        let dist = distFirst + ' ' + distSecond;

        const oHours = openingHours.find(o => o.day === (new Date).getDay());

        let oHoursString = strings('stores.closed');

        if (oHours && oHours.open && oHours.close) {
            oHoursString = oHours.open + ' - ' + oHours.close;
        }

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.container}
                onPress={onPress}>
                <View style={styles.cardContainer}>
                    {!!banner &&
                    <FastImage
                        style={styles.bannerImage}
                        source={{uri: banner}}>
                        <View style={styles.bannerTextBarContainer}>
                            <View style={styles.iconContainer}>
                                {!!logo &&
                                <FastImage
                                    style={styles.logoImage}
                                    resizeMode={FastImage.resizeMode.contain}
                                    source={{uri: logo}}/>
                                }
                            </View>
                        </View>
                    </FastImage>
                    }
                    <View style={styles.contentContainer}>
                        <View style={styles.leftContainer}>
                            {!!dist &&
                            <CustomText style={styles.leftText}>{dist}</CustomText>
                            }
                        </View>
                        <View style={styles.contentTextContainer}>
                            {!!name &&
                            <CustomText
                                style={styles.mainText}>{name}</CustomText>
                            }
                            {!!oHoursString &&
                            <CustomText
                                style={styles.subText}>{oHoursString}</CustomText>
                            }
                        </View>
                        <View style={styles.rightContainer}>
                            {!!refundPercentage &&
                            <CustomText
                                style={styles.rightText}>{strings('stores.refund') + '\n' + (refundPercentage.toFixed(2).replace(/[.,]00$/, '')) + ' %'}</CustomText>
                            }
                            {!refundPercentage &&
                            <CustomText
                                style={styles.rightText}>{strings('stores.no_refund')}</CustomText>
                            }
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
        backgroundColor: colors.slightlyDarkerColor
    },
    iconContainer: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor,
        borderRadius: 40,
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.separatorColor
    },
    logoImage: {
        height: 40,
        width: 40,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardContainer: {
        height: 170,
        backgroundColor: colors.backgroundColor,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.separatorColor
    },
    bannerImage: {
        justifyContent: 'center',
        width: '100%',
        height: 120
    },
    bannerTextBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    leftContainer: {
        flex: 1,
        marginLeft: 20,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    rightContainer: {
        flex: 1,
        marginRight: 20,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    leftText: {
        fontSize: 12,
        textAlign: 'left'
    },
    rightText: {
        fontSize: 12,
        textAlign: 'right'
    },
    contentContainer: {
        flex: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    contentTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainText: {
        color: colors.darkTextColor,
        fontSize: 16,
        fontWeight: 'bold'
    },
    subText: {
        fontSize: 13
    }
});