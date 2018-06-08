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
import {Marker} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';


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
            data: [{
                location: {
                    latitude: 55.789354,
                    longitude: 12.525010
                }
            }, {
                location: {
                    latitude: 55.789495,
                    longitude: 12.518121
                }
            }, {
                location: {
                    latitude: 55.785672,
                    longitude: 12.514128
                }
            }],
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
        )
    };

    renderMarker = (data) =>
        <Marker key={data.id || Math.random()}
                coordinate={data.location}
                style={styles.markerContainer}
                image={require('../../assets/refundeo_logo.png')}>
        </Marker>;

    render() {
        return (
            <View style={styles.container}>
                {this.state.cameraPermission &&
                <ClusteredMapView
                    style={styles.container}
                    data={this.state.data}
                    showsUserLocation={true}
                    edgePadding={{top: 20, left: 20, bottom: 20, right: 20}}
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
            </View>
        );
    }
}

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

const styles = StyleSheet.create({
    tabBarIcon: {
        fontSize: 20
    },
    container: {
        flex: 1
    },
    clusterContainer: {
        width: 30,
        height: 30,
        padding: 6,
        borderWidth: 1,
        borderRadius: 15,
        alignItems: 'center',
        borderColor: colors.activeTabColor,
        justifyContent: 'center',
        backgroundColor: colors.backgroundColor,
    },
    clusterText: {
        fontSize: 15,
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
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StoresScreen);