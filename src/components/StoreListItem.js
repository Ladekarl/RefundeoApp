import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import Location from '../shared/Location';
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
        rating: PropTypes.number,
        priceLevel: PropTypes.number,
        address: PropTypes.string.isRequired
    };

    getPriceLevel = () => {
        const priceLevel = this.props.priceLevel;
        let priceLevels = Array(priceLevel).fill(0);
        priceLevels = priceLevels.map(() => {
            return (<Icon style={styles.priceLevel} key={Math.random()} name='usd'/>);
        });
        return priceLevels;
    };


    render() {
        const {
            distance,
            refundPercentage,
            openingHours,
            tags,
            rating,
            priceLevel,
            name,
            address,
            onPress
        } = this.props;

        const dist = Location.calculateDistance(distance);

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
                            <CustomText
                                style={styles.merchantName}
                                numberOfLines={1}>
                                {name}
                            </CustomText>
                            {!!rating &&
                            <View style={styles.ratingContainer}>
                                <CustomText
                                    style={styles.ratingText}>{rating.toFixed(1).replace(/[.,]0$/, '')}</CustomText>
                            </View>
                            }
                            {!!priceLevel &&
                            <View style={styles.priceLevelContainer}>
                                {this.getPriceLevel()}
                            </View>
                            }
                        </View>
                        <View style={styles.leftRowContainer}>
                            {!!tags &&
                            <View style={styles.leftInnerLeftContainer}>
                                <Icon style={styles.tagIcon} name='tag'/>
                            </View>
                            }
                            <View style={styles.leftInnerTopRightContainer}>
                                {!!tags &&
                                <CustomText style={styles.tagText}>
                                    {
                                        tags.map((t, i) => t.displayName + (i !== tags.length - 1 ? ', ' : '')).map(t => {
                                            return t;
                                        })
                                    }
                                </CustomText>
                                }
                            </View>
                        </View>
                        <View style={styles.leftRowContainer}>
                            {!!address &&
                            <View style={styles.leftInnerLeftContainer}>
                                <Icon style={styles.addressIcon} name='map-marker'/>
                            </View>
                            }
                            {!!address &&
                            <View style={styles.leftInnerRightContainer}>
                                <CustomText style={styles.addressText}>{address}</CustomText>
                                <CustomText style={styles.distText}>{'(' + dist + ')'}</CustomText>
                                <Icon name='clock-o' style={styles.clockIcon}/>
                                <CustomText style={styles.oHoursText}>{oHoursString}</CustomText>
                            </View>
                            }
                        </View>
                    </View>
                    <View style={styles.rightColumnContainer}>
                        <View style={styles.rightInnerLeftColumnContainer}>
                            <CustomText style={styles.saveText}>SAVE FROM</CustomText>
                            {!!refundPercentage &&
                            <CustomText
                                style={styles.refundText}>{refundPercentage.toFixed(1).replace(/[.,]0$/, '') + ' %'}</CustomText>
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
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        marginRight: 10,
        borderRadius: 5,
        minHeight: 90,
        backgroundColor: colors.whiteColor,
        flexDirection: 'row'
    },
    leftColumnContainer: {
        flex: 1.5,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    rightColumnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    topLeftRowContainer: {
        flex: 1.33,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftRowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 17
    },
    leftInnerTopRightContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    leftInnerRightContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    merchantName: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: colors.darkTextColor,
        fontSize: 18,
        textAlign: 'center',
        marginRight: 5
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
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5
    },
    ratingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        marginRight: 5,
        aspectRatio: 1,
        backgroundColor: colors.activeTabColor,
        borderRadius: 4
    },
    priceLevel: {
        fontSize: 12,
        color: colors.darkTextColor
    },
    tagIcon: {
        color: colors.darkTextColor,
        fontSize: 15,
        marginRight: 3
    },
    clockIcon: {
        color: colors.darkTextColor,
        fontSize: 15,
        marginRight: 3,
        marginLeft: 10
    },
    ratingText: {
        color: colors.whiteColor,
        fontSize: 15
    },
    addressIcon: {
        color: colors.darkTextColor,
        fontSize: 15,
        marginRight: 3
    },
    addressText: {
        fontSize: 12
    },
    distText: {
        fontSize: 12,
        marginLeft: 3
    },
    oHoursText: {
        fontSize: 12
    },
    tagText: {
        minWidth: '45%',
        fontSize: 12
    }
});