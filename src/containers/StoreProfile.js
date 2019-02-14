import React, {Component} from 'react';
import {StyleSheet, View, Platform, ScrollView} from 'react-native';
import colors from '../shared/colors';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {strings} from '../shared/i18n';
import Location from '../shared/Location';
import CustomText from '../components/CustomText';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-navigation';
import PlaceHolderFastImage from '../components/PlaceHolderFastImage';
import MapView, {Marker} from 'react-native-maps';

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

        let distance = Location.calculateDistance(selectedMerchant.distance);

        let oHoursString =
            openingHours && openingHours.open && openingHours.close ?
                openingHours.open + ' - ' + openingHours.close : strings('stores.closed');
        let storeImage = selectedMerchant.banner ?
            {uri: selectedMerchant.banner} : require('../../assets/refundeo_logo.png');

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.leftContainer}>
                        <CustomText style={styles.aboutText}>ABOUT STORE</CustomText>
                    </View>
                    <View style={styles.rightContainer}>
                        <PlaceHolderFastImage
                            contentContainerStyle={styles.imageContainer}
                            resizeMode={FastImage.resizeMode.cover}
                            source={storeImage}
                            style={styles.storeImage}
                        />
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                region={{
                                    latitude: selectedMerchant.latitude,
                                    longitude: selectedMerchant.longitude,
                                    latitudeDelta: 0.002,
                                    longitudeDelta: 0.002
                                }}>
                                <Marker
                                    coordinate={{
                                        latitude: selectedMerchant.latitude,
                                        longitude: selectedMerchant.longitude
                                    }}
                                    title={selectedMerchant.companyName}
                                    description={distance}
                                />
                            </MapView>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <CustomText style={styles.offersText}>YOUR OFFERS</CustomText>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.backgroundColor
    },
    topContainer: {
        flex: 2,
        flexDirection: 'row',
    },
    bottomContainer: {
        flex: 1.4,
        borderRadius: 3,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 3,
        marginBottom: 50,
        backgroundColor: colors.whiteColor
    },
    leftContainer: {
        flex: 1,
        borderRadius: 4,
        marginLeft: 6,
        marginRight: 3,
        marginBottom: 3,
        backgroundColor: colors.whiteColor
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 6
    },
    imageContainer: {
        flex: 1.3,
        borderRadius: 4,
        marginLeft: 3,
        marginBottom: 3,
        backgroundColor: colors.whiteColor
    },
    storeImage: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    mapContainer: {
        flex: 2,
        borderRadius: 4,
        marginLeft: 3,
        marginBottom: 3,
        marginTop: 3,
        backgroundColor: colors.whiteColor
    },
    aboutText: {
        textAlign: 'center',
        fontSize: 22,
        margin: 5,
        color: colors.backgroundColor
    },
    offersText: {
        textAlign: 'center',
        fontSize: 22,
        margin: 5,
        color: colors.backgroundColor
    },
    map: {
        flex: 1,
        borderRadius: 4
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