import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, Platform, Image, Text, ScrollView} from 'react-native';
import colors from '../shared/colors';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {strings} from '../shared/i18n';

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

        return (
            <ScrollView styles={styles.container}>
                <ImageBackground
                    style={styles.bannerImage}
                    source={{uri: 'data:image/png;base64,' + selectedMerchant.banner}}
                    borderRadius={2}>
                    <View style={styles.iconContainer}>
                        <Image style={styles.logoImage} resizeMode='contain'
                               source={{uri: 'data:image/png;base64,' + selectedMerchant.logo}}/>
                    </View>
                </ImageBackground>
                <View style={styles.bannerTextBarContainer}>
                    <View style={styles.bannerColumnContainer}>
                        <Text style={styles.leftText}>{strings('stores.opening_hours')}</Text>
                        <Text style={styles.leftText}>{strings('stores.refund_percentage')}</Text>
                    </View>
                    <View style={styles.bannerColumnContainer}>
                        <Text style={styles.contentText}>{selectedMerchant.openingHours}</Text>
                        <Text style={styles.contentText}>{95 - selectedMerchant.refundPercentage}</Text>
                    </View>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text>
                        {selectedMerchant.description}
                    </Text>
                </View>
                <View style={styles.addressContainer}>
                    <Text style={styles.addressTitleText}>{strings('stores.address')}</Text>
                    <Text style={styles.addressText}>
                        {`${selectedMerchant.addressStreetName} ${selectedMerchant.addressStreetNumber}, ${selectedMerchant.addressPostalCode} ${selectedMerchant.addressCity}, ${selectedMerchant.addressCountry}`}
                    </Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    bannerImage: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
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
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.activeTabColor,
        padding: 10
    },
    bannerColumnContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    leftText: {
        margin: 5,
        color: colors.separatorColor
    },
    contentText: {
        margin: 5,
        color: colors.backgroundColor
    },
    descriptionContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: colors.backgroundColor
    },
    addressContainer: {
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 15,
        backgroundColor: colors.backgroundColor
    },
    addressTitleText: {
        color: colors.activeTabColor,
        fontSize: 15
    },
    addressText: {
        color: colors.darkTextColor,
        marginTop: 10,
        fontSize: 15
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