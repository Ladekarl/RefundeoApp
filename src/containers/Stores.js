import {connect} from 'react-redux';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
// eslint-disable-next-line react-native/split-platform-components
import {Text, View, StyleSheet, PermissionsAndroid, Platform} from 'react-native';
import {strings} from '../shared/i18n';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import {Callout, Marker} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import StoresList from '../components/StoresList';


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
            isMap: true,
            data: [
                {
                    location: {
                        latitude: 55.745172,
                        longitude: 12.544128
                    }
                },
                {
                    location: {
                        latitude: 55.676155,
                        longitude: 12.568355
                    }
                },
                {
                    location: {
                        latitude: 55.678155,
                        longitude: 12.528355
                    }
                },
                {
                    location: {
                        latitude: 55.671155,
                        longitude: 12.561355
                    }
                }
            ],
            cameraPermission: false
        };
    }

    initRegion = {
        latitude: 55.789354,
        longitude: 12.525010,
        latitudeDelta: 12,
        longitudeDelta: 12
    };

    componentDidMount() {
        if (Platform.OS === 'ios') {
            navigator.geolocation.getCurrentPosition(this.setLocation);
        } else {
            this.requestAndroidPermission().catch(() => {
                this.setState({cameraPermission: true});
            });
        }
    }

    async requestAndroidPermission() {
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (hasPermission) {
            navigator.geolocation.getCurrentPosition(this.setLocation);
        } else {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    'title': strings('stores.permission_title'),
                    'message': strings('stores.permission_message')
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                navigator.geolocation.getCurrentPosition(this.setLocation);
            } else {
                throw granted;
            }
        }
    }

    setLocation = (location) => {
        this.initRegion = {
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
            ...location.coords
        };
        this.setState({cameraPermission: true});
    };

    onCalloutPress = () => {
        this.props.actions.navigateStoreProfile();
    };

    renderCluster = (cluster, onPress) => {
        const pointCount = cluster.pointCount,
            coordinate = cluster.coordinate,
            clusterId = cluster.clusterId;

        return (
            <Marker identifier={`cluster-${clusterId}`} coordinate={coordinate} onPress={onPress}>
                <View style={styles.clusterContainer}>
                    <Text style={styles.clusterText}>
                        {pointCount}
                    </Text>
                </View>
            </Marker>
        );
    };

    renderMarker = (data) =>
        <Marker key={data.id || Math.random()}
                coordinate={data.location}
                style={styles.markerContainer}>
            <Callout onPress={this.onCalloutPress}>
                <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>Example store</Text>
                    <Icon style={styles.calloutIcon} name='angle-right'/>
                </View>
            </Callout>
        </Marker>;

    render() {
        const {navigation} = this.props.state;

        return (
            <View style={styles.container}>
                {this.state.cameraPermission && navigation.isMap &&
                <ClusteredMapView
                    style={styles.container}
                    data={this.state.data}
                    showsUserLocation={true}
                    edgePadding={{top: 100, left: 100, bottom: 100, right: 100}}
                    initialRegion={this.initRegion}
                    clusteringEnabled={true}
                    clusterInitialFontSize={15}
                    showsMyLocationButton={true}
                    animateClusters={true}
                    getMapRef={(r) => this.map = r}
                    ref={(r) => this.clusterMap = r}
                    renderMarker={this.renderMarker}
                    renderCluster={this.renderCluster}/>
                }
                {!navigation.isMap &&
                    <StoresList actions={this.props.actions}/>
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
            ...state.refundReducer
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