import React from 'react';
import {View, StyleSheet, Text, Slider, Switch, Platform} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import Icon from 'react-native-fa-icons';
import geolib from 'geolib';
import ModalScreen from './Modal';

export default class StoreFilter extends React.PureComponent {

    static propTypes = {
        filterRefundSliderValue: PropTypes.number.isRequired,
        filterDistanceSliderValue: PropTypes.number.isRequired,
        filterOnlyOpenValue: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            ...this.getInitialFilterState()
        };
    }

    getInitialFilterState = () => {
        return {
            filterRefundSliderValue: this.props.filterRefundSliderValue,
            filterDistanceSliderValue: this.props.filterDistanceSliderValue,
            filterOnlyOpenValue: this.props.filterOnlyOpenValue
        };
    };

    distanceSliderValuesChange = (filterDistanceSliderValue) => {
        this.setState({
            filterDistanceSliderValue
        });
    };

    refundSliderValuesChange = (filterRefundSliderValue) => {
        this.setState({
            filterRefundSliderValue
        });
    };

    onlyOpenValueChange = (filterOnlyOpenValue) => {
        this.setState({
            filterOnlyOpenValue
        });
    };

    getDistanceSliderValue = (sliderValue) => {
        if (sliderValue >= 1000) {
            if (sliderValue >= 10000) {
                return strings('stores.distance_all');
            } else {
                return geolib.convertUnit('km', sliderValue, 1) + ' km';
            }
        } else {
            return sliderValue + ' m';
        }
    };

    getDistanceValue = () => {
        return this.state.filterDistanceSliderValue;
    };

    getRefundSliderValue = () => {
        return this.state.filterRefundSliderValue;
    };

    getOnlyOpenValue = () => {
        return this.state.filterOnlyOpenValue;
    };


    render() {
        const distanceValue = this.getDistanceSliderValue(this.state.filterDistanceSliderValue);

        return (
            <View style={styles.filterContainer}>
                <View style={styles.filterRowContainerNoBorder}>
                    <Text style={styles.filterTitle}>
                        {strings('stores.open_hours_filter')}
                    </Text>
                    <View style={styles.filterSwitchContainer}>
                        <Text style={styles.filterSwitchText}>{strings('stores.open_stores_filter')}</Text>
                        <Switch
                            value={this.state.filterOnlyOpenValue}
                            tintColor={Platform.OS === 'ios' ? colors.activeTabColor : undefined}
                            thumbTintColor={colors.activeTabColor}
                            onValueChange={this.onlyOpenValueChange}
                        />
                    </View>
                </View>
                <View style={styles.filterRowContainer}>
                    <Text style={styles.filterTitle}>
                        {strings('stores.distance')}
                    </Text>
                    <Text style={styles.filterSliderText}>
                        {distanceValue}
                    </Text>
                    <View style={styles.filterSliderContainer}>
                        <Icon name='car' style={styles.filterIcon}/>
                        <Slider
                            value={this.state.filterDistanceSliderValue}
                            minimumValue={0}
                            maximumValue={10000}
                            step={100}
                            thumbTintColor={colors.activeTabColor}
                            minimumTrackTintColor={colors.activeTabColor}
                            style={styles.filterSlider}
                            selectedStyle={styles.filterTrackStyle}
                            onValueChange={this.distanceSliderValuesChange}
                        />
                    </View>
                </View>
                <View style={styles.filterRowContainer}>
                    <Text style={styles.filterTitle}>
                        {strings('stores.refund_percentage_filter')}
                    </Text>
                    <Text style={styles.filterSliderText}>
                        {this.state.filterRefundSliderValue + ' %'}</Text>
                    <View style={styles.filterSliderContainer}>
                        <Icon name='money' style={styles.filterIcon}/>
                        <Slider
                            value={this.state.filterRefundSliderValue}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            thumbTintColor={colors.activeTabColor}
                            minimumTrackTintColor={colors.activeTabColor}
                            style={styles.filterSlider}
                            selectedStyle={styles.filterTrackStyle}
                            onValueChange={this.refundSliderValuesChange}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    filterContainer: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: -10,
        marginRight: -10
    },
    filterRowContainerNoBorder: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10
    },
    filterRowContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.separatorColor,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        paddingTop: 10
    },
    filterTitle: {
        color: colors.darkTextColor
    },
    filterSliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%'
    },
    filterSwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        marginBottom: 10
    },
    filterSlider: {
        marginLeft: 10,
        marginBottom: 10,
        flex: 1
    },
    filterSliderText: {
        fontSize: 20,
        marginBottom: 5,
        marginTop: 5,
        alignSelf: 'center'
    },
    filterTrackStyle: {
        backgroundColor: colors.activeTabColor,
    },
    filterIcon: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 20,
        marginBottom: 10,
        marginRight: 10,
        color: colors.darkTextColor
    },
    filterSwitchText: {
        fontWeight: 'bold',
        color: colors.darkTextColor,
        marginBottom: 5,
        marginLeft: 20,
        marginTop: 5,
        alignSelf: 'center',
        textAlign: 'center'
    }
});