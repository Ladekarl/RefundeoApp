import {connect} from 'react-redux';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {strings} from '../shared/i18n';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import {Callout, Marker} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import StoresList from '../components/StoresList';
import Location from '../shared/Location';

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
        tabBarIcon: ({tintColor}) => (
            <Icon name='map' style={[styles.tabBarIcon, {color: tintColor}]}/>),
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
            <Marker identifier={'cluster-' + cluster.clusterId} coordinate={cluster.coordinate} onPress={onPress}>
                <View style={styles.clusterContainer}>
                    <Text style={styles.clusterText}>
                        {cluster.pointCount}
                    </Text>
                </View>
            </Marker>
        );
    };

    renderMarker = (merchant) => {
        return (
            <Marker key={merchant.id}
                    style={styles.markerContainer} coordinate={merchant.location}>
                <Callout onPress={() => this.onCalloutPress(merchant)}>
                    <View style={styles.calloutContainer}>
                        <Text style={styles.calloutText}>{merchant.companyName}</Text>
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
        const {navigation, merchants, fetchingMerchants, filterDistanceSliderValue, filterRefundSliderValue, filterOnlyOpenValue, filterTag} = this.props.state;

        let clusteredMapData = [];

        if (merchants) {
            clusteredMapData = this.getClusteredMapData(merchants);
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
        color: colors.activeTabColor,
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
        color: colors.activeTabColor,
        fontSize: 15
    },
    calloutIcon: {
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: 10,
        color: colors.activeTabColor
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