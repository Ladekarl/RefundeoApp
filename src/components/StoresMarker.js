import {StyleSheet, Text, View, Image} from 'react-native';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Marker} from 'react-native-maps';

const offset_map_small = 0.0001;
import ImageMarker from '../../assets/marker.png';
import colors from '../shared/colors';

export default class StoresMarker extends Component {

    static propTypes = {
        feature: PropTypes.shape({
            properties: PropTypes.shape({
                cluster_id: PropTypes.string.isRequired,
                featureclass: PropTypes.object,
                point_count: PropTypes.number
            }).isRequired,
            geometry: PropTypes.shape({
                coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
            }).isRequired
        }),
        clusters: PropTypes.shape({
            places: PropTypes.shape({
                getChildren: PropTypes.function.isRequired
            }).isRequired
        }).isRequired,
        region: PropTypes.object.isRequired,
        onPress: PropTypes.function
    };

    state = {
        colorByCategory: {
            A: 'violet',
            B: 'yellow',
            C: 'blue',
            D: 'pink',
            E: 'green',
            'Cluster': 'red'
        }
    };

    onPress() {
        if (!this.props.feature.properties.featureclass) {

            const {region} = this.props;
            const category = this.props.feature.properties.featureclass || 'Cluster';
            const angle = region.longitudeDelta || 0.0421 / 1.2;
            const result = Math.round(Math.log(360 / angle) / Math.LN2);

            const markers = this.props.clusters['places'].getChildren(this.props.feature.properties.cluster_id, result);
            const newRegion = [];
            const smallZoom = 0.05;

            markers.map(function (element) {
                newRegion.push({
                    latitude: offset_map_small + element.geometry.coordinates[1] - region.latitudeDelta * smallZoom,
                    longitude: offset_map_small + element.geometry.coordinates[0] - region.longitudeDelta * smallZoom,
                });

                newRegion.push({
                    latitude: offset_map_small + element.geometry.coordinates[1],
                    longitude: offset_map_small + element.geometry.coordinates[0],
                });

                newRegion.push({
                    latitude: offset_map_small + element.geometry.coordinates[1] + region.latitudeDelta * smallZoom,
                    longitude: offset_map_small + element.geometry.coordinates[0] + region.longitudeDelta * smallZoom,
                });
            });

            const options = {
                isCluster: true,
                region: newRegion,
            };

            if (this.props.onPress) {
                this.props.onPress({
                    type: category,
                    feature: this.props.feature,
                    options: options,
                });
            }
        }
    }


    render() {
        const latitude = this.props.feature.geometry.coordinates[1];
        const longitude = this.props.feature.geometry.coordinates[0];
        const category = this.props.feature.properties.featureclass || 'Cluster';
        const text = (category == 'Cluster' ? this.props.feature.properties.point_count : category);
        //const size = 37;
        return (
            <Marker
                coordinate={{
                    latitude,
                    longitude,
                }}
                onPress={this.onPress.bind(this)}>
                <Image
                    style={{
                        tintColor: this.state.colorByCategory[category],
                    }}
                    source={ImageMarker}
                <View
                />
                    style={styles.markerTextContainer}>
                    <Text style={styles.markerText}>
                        {text}
                    </Text>
                </View>
            </Marker>
        );
    }
}

const styles = StyleSheet.create({
    markerTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerText: {
        fontSize: 10,
        color: colors.backgroundColor,
        textAlign: 'center',
    }
});