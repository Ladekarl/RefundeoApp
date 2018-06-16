import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, Platform, Image, Text, ScrollView} from 'react-native';
import colors from '../shared/colors';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

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
                    source={require('../../assets/example-store.jpg')}
                    borderRadius={2}>
                    <View style={styles.iconContainer}>
                        <Image style={styles.logoImage} resizeMode='contain'
                               source={require('../../assets/refundeo_banner_small.png')}/>
                    </View>
                </ImageBackground>
                <View style={styles.bannerTextBarContainer}>
                    <View style={styles.bannerColumnContainer}>
                        <Text style={styles.leftText}>Opening hours</Text>
                        <Text style={styles.leftText}>Refund Percentage</Text>
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
                    <Text style={styles.addressTitleText}>Address</Text>
                    <Text style={styles.addressText}>
                        {`${selectedMerchant.addressStreetName} ${selectedMerchant.addressStreetNumber}, ${selectedMerchant.addressPostalCode} ${selectedMerchant.addressCountry}`}
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
        height: 70,
        width: 70,
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
        color: colors.inactiveTabColor
    },
    contentText: {
        margin: 5,
        color: colors.backgroundColor
    },
    descriptionContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    addressContainer: {
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 15
    },
    addressTitleText: {
        color: colors.activeTabColor
    },
    addressText: {
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