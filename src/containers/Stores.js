import {connect} from 'react-redux';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {strings} from '../shared/i18n';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import {Callout, Marker} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import StoresList from '../components/StoresList';
import Location from '../shared/Location';
import CustomText from '../components/CustomText';

class StoresScreen extends Component {

    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    static navigationOptions = {
        title: strings('settings.settings'),
        headerTitleStyle: {
            fontSize: 18
        },
        tabBarIcon: ({tintColor}) => {
            if (tintColor === colors.activeTabColor) return (
                <View style={styles.outerContainer}><Icon name='map'
                                                          style={[styles.tabBarIcon, {color: tintColor}]}/></View>);
            else return (
                <Icon name='map' style={[styles.tabBarIcon, {color: tintColor}]}/>);
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            locationPermission: false
        };
    }

    initRegion = {
        latitude: 55.789354,
        longitude: 12.525010,
        latitudeDelta: 12,
        longitudeDelta: 12
    };

    componentDidMount() {
        Location.getCurrentPosition()
            .then((location) => this.setLocation(location))
            .catch(() => {
                this.setState({locationPermission: false});
            });
    }

    filterMerchants = (merchants, distance, minRefund, onlyOpen, tag) => {
        let filteredMerchants = [];
        const currentDate = new Date();
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentDay = currentDate.getDay();
        merchants.forEach((merchant) => {
            const dist = merchant.distance;
            if ((dist <= distance || distance === 10000) && (minRefund === 0 || merchant.refundPercentage >= minRefund) && (!tag.value || merchant.tags.findIndex(t => t.value === tag.value) > -1)) {
                if (onlyOpen) {
                    const openingHours = merchant.openingHours.find(o => o.day === currentDay);
                    if (openingHours && openingHours.open && openingHours.close) {
                        const openStrSplit = openingHours.open.split(':');
                        const closeStrSplit = openingHours.close.split(':');
                        const openHours = parseInt(openStrSplit[0]);
                        const openMinutes = parseInt(openStrSplit[1]);
                        const closeHours = parseInt(closeStrSplit[0]);
                        const closeMinutes = parseInt(closeStrSplit[1]);

                        const isOpenHours = currentHours > openHours || (currentHours === openHours && currentMinutes >= openMinutes);
                        const isCloseHours = currentHours < closeHours || (currentHours === closeHours && currentMinutes <= closeMinutes);

                        if (isOpenHours && isCloseHours) {
                            filteredMerchants.push(merchant);
                        }
                    }
                } else {
                    filteredMerchants.push(merchant);
                }
            }
        });
        return filteredMerchants;
    };

    setLocation = (location) => {
        this.initRegion = {
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
            ...location.coords
        };

        this.setState({locationPermission: true});
    };


    onCalloutPress = (merchant) => {
        this.props.actions.selectMerchant(merchant);
    };

    renderCluster = (cluster, onPress) => {
        return (
            <Marker identifier={`cluster-${cluster.clusterId}`} coordinate={cluster.coordinate} onPress={onPress}>
                <View style={styles.clusterContainer}>
                    <CustomText style={styles.clusterText}>
                        {cluster.pointCount}
                    </CustomText>
                </View>
            </Marker>
        );
    };

    renderMarker = (merchant) => {
        return (
            <Marker key={merchant.vatNumber}
                    style={styles.markerContainer} coordinate={merchant.location}>
                <Callout onPress={() => this.onCalloutPress(merchant)}>
                    <View style={styles.calloutContainer}>
                        <CustomText style={styles.calloutText}>{merchant.companyName}</CustomText>
                        <Icon style={styles.calloutIcon} name='angle-right'/>
                    </View>
                </Callout>
            </Marker>
        );
    };

    getClusteredMapData = (merchants) => {
        return merchants.map((merchant) => {
            return {
                ...merchant,
                location: {
                    latitude: merchant.latitude,
                    longitude: merchant.longitude
                }
            };
        });
    };

    render() {
        const {
            navigation,
            merchants,
            fetchingMerchants,
            filterDistanceSliderValue,
            filterRefundSliderValue,
            filterOnlyOpenValue,
            filterTag,
            isFilterActive
        } = this.props.state;

        let clusteredMapData = [];

        let filteredMerchants = [];

        if (merchants) {
            filteredMerchants = this.filterMerchants(
                merchants,
                filterDistanceSliderValue,
                filterRefundSliderValue,
                filterOnlyOpenValue,
                filterTag
            );
            clusteredMapData = this.getClusteredMapData(filteredMerchants);
        }

        return (
            <View style={styles.container}>
                {this.state.locationPermission && navigation.isMap &&
                <ClusteredMapView
                    style={styles.container}
                    data={clusteredMapData}
                    showsUserLocation={true}
                    edgePadding={{top: 100, left: 100, bottom: 100, right: 100}}
                    initialRegion={this.initRegion}
                    clusteringEnabled={true}
                    clusterInitialFontSize={15}
                    showsMyLocationButton={true}
                    animateClusters={true}
                    renderMarker={this.renderMarker}
                    renderCluster={this.renderCluster}/>
                }
                {!navigation.isMap && merchants &&
                <StoresList
                    actions={this.props.actions}
                    merchants={merchants}
                    distance={filterDistanceSliderValue}
                    minRefund={filterRefundSliderValue}
                    onlyOpen={filterOnlyOpenValue}
                    tag={filterTag}
                    fetching={fetchingMerchants}
                />
                }
                {isFilterActive &&
                <View style={styles.filterActiveContainer}>
                    <CustomText style={styles.filterActiveText}>{strings('stores.filter_on')}</CustomText>
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabBarIcon: {
        fontSize: 20
    },
    container: {
        flex: 1
    },
    clusterContainer: {
        width: 40,
        height: 40,
        padding: 6,
        borderWidth: 1,
        borderRadius: 40,
        alignItems: 'center',
        borderColor: colors.activeTabColor,
        justifyContent: 'center',
        backgroundColor: colors.backgroundColor,
    },
    clusterText: {
        fontSize: 18,
        color: colors.whiteColor,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    markerContainer: {
        height: 0,
        width: 0,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    calloutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5
    },
    calloutText: {
        color: colors.backgroundColor,
        fontSize: 15
    },
    calloutIcon: {
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: 10,
        color: colors.backgroundColor
    },
    outerContainer: {
        borderColor: colors.addButtonOuterColor,
        borderWidth: 4,
        padding: 4,
        backgroundColor: colors.addButtonInnerColor,
        borderRadius: 20
    },
    filterActiveContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 2,
        paddingBottom: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundColorOpaque
    },
    filterActiveText: {
        fontSize: 11,
        color: colors.whiteColor
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
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
)(StoresScreen);