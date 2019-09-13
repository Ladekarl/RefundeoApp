import React, {Component} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import colors from '../shared/colors';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {strings} from '../shared/i18n';
import CustomText from '../components/CustomText';
import FastImage from 'react-native-fast-image';
import PlaceHolderFastImage from '../components/PlaceHolderFastImage';

class StoreProfile extends Component {

    static propTypes = {
        state: PropTypes.object.isRequired
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('companyName', '...'),
            headerTitleStyle: {
                fontSize: 18
            }
        };
    };

    render() {
        const {selectedMerchant} = this.props.state;
        const openingHours = selectedMerchant.openingHours.find(o => o.day === (new Date).getDay());

        let oHoursString = strings('stores.closed');

        if (openingHours && openingHours.open && openingHours.close) {
            oHoursString = openingHours.open + ' - ' + openingHours.close;
        }

        return (
            <View style={styles.container}>
                <ScrollView styles={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                    <PlaceHolderFastImage
                        style={styles.bannerImage}
                        placeholder={
                            <FastImage
                                resizeMode={FastImage.resizeMode.contain}
                                style={styles.placeHolderImage}
                                source={require('../../assets/refundeo_banner_medium.png')}/>
                        }
                        source={{uri: selectedMerchant.banner}}
                        borderRadius={2}>
                        {!!selectedMerchant.logo &&
                        <View style={styles.flexIconContainer}>
                            <View style={styles.iconContainer}>
                                <FastImage
                                    style={styles.logoImage}
                                    resizeMode={FastImage.resizeMode.contain}
                                    source={{uri: selectedMerchant.logo}}/>
                            </View>
                        </View>
                        }
                    </PlaceHolderFastImage>
                    <View style={styles.bannerTextBarContainer}>
                        <View style={styles.bannerColumnContainer}>
                            <CustomText style={styles.leftText}>{strings('stores.opening_hours')}</CustomText>
                            <CustomText style={styles.leftText}>{strings('stores.refund_percentage')}</CustomText>
                        </View>
                        <View style={styles.bannerColumnContainer}>
                            {!!oHoursString &&
                            <CustomText
                                style={styles.contentText}>{oHoursString}</CustomText>
                            }
                            {!!selectedMerchant.refundPercentage &&
                            <CustomText
                                style={styles.contentText}>{selectedMerchant.refundPercentage.toFixed(2).replace(/[.,]00$/, '') + ' %'}</CustomText>
                            }
                            {!selectedMerchant.refundPercentage &&
                            <CustomText
                                style={styles.contentText}>{strings('stores.no_refund')}</CustomText>
                            }
                        </View>
                        <View style={styles.bannerColumnContainer}/>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <CustomText style={styles.descriptionText}>
                            {selectedMerchant.description}
                        </CustomText>
                    </View>
                    <View style={styles.bottomContentContainer}>
                        <View style={styles.bottomContainer}>
                            <CustomText style={styles.bottomTitleText}>{strings('stores.address')}</CustomText>
                            <CustomText style={styles.bottomText}>
                                {`${selectedMerchant.addressStreetName} ${selectedMerchant.addressStreetNumber}, ${selectedMerchant.addressPostalCode} ${selectedMerchant.addressCity}, ${selectedMerchant.addressCountry}`}
                            </CustomText>
                        </View>
                        <View style={styles.bottomContainer}>
                            <CustomText style={styles.bottomTitleText}>{strings('stores.vat_number')}</CustomText>
                            <CustomText style={styles.bottomText}>
                                {selectedMerchant.vatNumber}
                            </CustomText>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    flexIconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.whiteColor,
        borderRadius: 40,
        padding: 6,
        elevation: 2,
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
    scrollContainer: {
        backgroundColor: colors.slightlyDarkerColor,
    },
    scrollContent: {
        paddingBottom: 15
    },
    bannerImage: {
        width: '100%',
        height: 180
    },
    placeHolderImage: {
        width: '90%',
        height: 160,
        alignSelf: 'center'
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.backgroundColor,
        padding: 10
    },
    bannerColumnContainer: {
        flex: 1
    },
    leftText: {
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        color: colors.slightlyDarkerColor
    },
    contentText: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 20,
        color: colors.whiteColor
    },
    descriptionContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        backgroundColor: colors.whiteColor
    },
    bottomContentContainer: {
        paddingTop: 15,
        paddingLeft: 15,
        paddingBottom: 15,
        paddingRight: 15,
        backgroundColor: colors.backgroundColor
    },
    bottomContainer: {
        padding: 10
    },
    bottomTitleText: {
        color: colors.activeTabColor,
        fontSize: 15
    },
    bottomText: {
        color: colors.whiteColor,
        marginTop: 10,
        fontSize: 15
    },
    descriptionText: {
        color: colors.darkTextColor
    }
});

const mapStateToProps = state => {
    return {
        state: {
            ...state.merchantReducer
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StoreProfile);