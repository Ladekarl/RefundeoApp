import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import geolib from 'geolib';
import {strings} from '../shared/i18n';
import CustomText from './CustomText';
import Icon from 'react-native-fa-icons';

export default class StoreListItem extends PureComponent {

    static propTypes = {
        distance: PropTypes.number.isRequired,
        refundPercentage: PropTypes.number,
        openingHours: PropTypes.array.isRequired,
        name: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
        tags: PropTypes.array.isRequired,
        priceLevel: PropTypes.number.isRequired,
        address: PropTypes.string.isRequired
    };


    render() {
        const {
            distance,
            refundPercentage,
            openingHours,
            tags,
            priceLevel,
            name,
            address,
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
                    <View style={styles.leftColumnContainer}>
                        <View style={styles.topLeftRowContainer}>
                            <CustomText style={styles.merchantName}>{name}</CustomText>
                        </View>
                        <View style={styles.leftRowContainer}>
                            {!!tags &&
                            <View style={styles.leftInnerLeftContainer}>
                                {tags.map((t, i) => t.displayName + (i !== tags.length - 1 ? ', ' : '')).map(t => {
                                    return (<CustomText key={t}>{t}</CustomText>);
                                })}
                            </View>
                            }
                            <View style={styles.leftInnerRightContainer}>
                                <Icon name='clock-o' style={styles.clockIcon}/>
                                <CustomText>{oHoursString}</CustomText>
                            </View>
                        </View>
                        <View style={styles.leftRowContainer}>
                            <View style={styles.leftInnerLeftContainer}>
                                <CustomText>{dist}</CustomText>
                            </View>
                            {!!address &&
                            <View style={styles.leftInnerRightContainer}>
                                <CustomText>{address}</CustomText>
                            </View>
                            }
                        </View>
                    </View>
                    <View style={styles.rightColumnContainer}>
                        <View style={styles.rightInnerLeftColumnContainer}>
                            <CustomText style={styles.saveText}>SAVE FROM</CustomText>
                            {!!refundPercentage &&
                            <CustomText
                                style={styles.refundText}>{refundPercentage.toFixed(2).replace(/[.,]00$/, '') + ' %'}</CustomText>
                            }
                        </View>
                        <View style={styles.rightInnerRightColumnContainer}>
                            <Icon style={styles.angleRight} name='angle-right'/>
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
        backgroundColor: colors.backgroundColor
    },
    cardContainer: {
        flex: 1,
        marginLeft: 10,
        padding: 5,
        marginRight: 10,
        borderRadius: 5,
        height: 90,
        backgroundColor: colors.whiteColor,
        flexDirection: 'row'
    },
    leftColumnContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    rightColumnContainer: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    topLeftRowContainer: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftRowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightInnerLeftColumnContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    rightInnerRightColumnContainer: {
        width: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftInnerLeftContainer: {
        flexDirection: 'row'
    },
    leftInnerRightContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    merchantName: {
        fontWeight: 'bold',
        fontSize: 25
    },
    saveText: {
        fontSize: 13,
        color: colors.darkTextColor
    },
    refundText: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    angleRight: {
        marginLeft: 5,
        fontSize: 30,
        color: colors.inactiveTabColor
    },
    priceLevelContainer: {
        marginLeft: 10,
        flexDirection: 'row'
    },
    priceLevel: {
        fontSize: 15,
        color: colors.darkTextColor
    },
    clockIcon: {
        color: colors.darkTextColor,
        textAlign: 'center'
    }
});