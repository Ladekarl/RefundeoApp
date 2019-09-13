import React from 'react';
import {View, StyleSheet, Slider, Switch, Platform, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import Icon from 'react-native-fa-icons';
import geolib from 'geolib';
import CustomText from './CustomText';
import Helpers from '../api/Helpers';

export default class StoreFilter extends React.PureComponent {

    static propTypes = {
        filterRefundSliderValue: PropTypes.number.isRequired,
        filterDistanceSliderValue: PropTypes.number.isRequired,
        filterOnlyOpenValue: PropTypes.bool.isRequired,
        tags: PropTypes.array,
        filterTagValue: PropTypes.object.isRequired
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
            filterOnlyOpenValue: this.props.filterOnlyOpenValue,
            filterTagValue: this.props.filterTagValue
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

    onTagPress = (tag) => {
        let newTag = {};
        if (this.state.filterTagValue !== tag) {
            newTag = tag;
        }
        this.setState({
            filterTagValue: newTag
        });
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

    getFilterTagValue = () => {
        return this.state.filterTagValue;
    };

    renderTags = () => {
        const tags = this.props.tags;
        if (!tags || tags.length === 0) return null;

        const arrayLength = tags.length;
        const renderedTags = [];
        const chunkSize = 4;
        const filterTagValue = this.state.filterTagValue;


        for (let i = 0; i < arrayLength; i += chunkSize) {
            const chunk = tags.slice(i, i + chunkSize > arrayLength ? arrayLength : i + chunkSize);

            renderedTags.push(
                <View style={styles.filterTagsContainer} key={Math.random()}>
                    {
                        chunk.map(t => {
                            const tagText = Helpers.getTagText(t);
                            if (tagText) {
                                return <TouchableOpacity
                                    style={filterTagValue.key === t.key ? styles.selectedFilterTag : styles.filterTag}
                                    key={t.key}
                                    onPress={() => this.onTagPress(t)}>
                                    <CustomText
                                        style={filterTagValue.key === t.key ? styles.selectedFilterTagText : styles.filterTagText}>{tagText}</CustomText>
                                </TouchableOpacity>;
                            }
                        })
                    }
                </View>
            );
        }
        return renderedTags;
    };

    render() {
        const distanceValue = this.getDistanceSliderValue(this.state.filterDistanceSliderValue);

        return (
            <View style={styles.filterContainer}>
                <View style={styles.filterRowContainerNoBorder}>
                    <CustomText style={styles.filterTitle}>
                        {strings('stores.open_hours_filter')}
                    </CustomText>
                    <View style={styles.filterSwitchContainer}>
                        <CustomText style={styles.filterSwitchText}>{strings('stores.open_stores_filter')}</CustomText>
                        <Switch
                            value={this.state.filterOnlyOpenValue}
                            trackColor={colors.activeTabColor}
                            thumbColor={colors.activeTabColor}
                            tintColor={colors.darkTextColor}
                            onValueChange={this.onlyOpenValueChange}
                        />
                    </View>
                </View>
                <View style={styles.filterRowContainer}>
                    <CustomText style={styles.filterTitle}>
                        {strings('stores.distance')}
                    </CustomText>
                    <CustomText style={styles.filterSliderText}>
                        {distanceValue}
                    </CustomText>
                    <View style={styles.filterSliderContainer}>
                        <Icon name='car' style={styles.filterIcon}/>
                        <Slider
                            value={this.props.filterDistanceSliderValue}
                            minimumValue={0}
                            maximumValue={10000}
                            step={100}
                            thumbTintColor={colors.activeTabColor}
                            minimumTrackTintColor={colors.activeTabColor}
                            maximumTrackTintColor={colors.whiteColor}
                            style={styles.filterSlider}
                            selectedStyle={styles.filterTrackStyle}
                            onValueChange={this.distanceSliderValuesChange}
                        />
                    </View>
                </View>
                <View style={styles.filterRowContainer}>
                    <CustomText style={styles.filterTitle}>
                        {strings('stores.refund_percentage_filter')}
                    </CustomText>
                    <CustomText style={styles.filterSliderText}>
                        {this.state.filterRefundSliderValue + ' %'}</CustomText>
                    <View style={styles.filterSliderContainer}>
                        <Icon name='money' style={styles.filterIcon}/>
                        <Slider
                            value={this.props.filterRefundSliderValue}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            thumbTintColor={colors.activeTabColor}
                            minimumTrackTintColor={colors.activeTabColor}
                            maximumTrackTintColor={colors.whiteColor}
                            style={styles.filterSlider}
                            selectedStyle={styles.filterTrackStyle}
                            onValueChange={this.refundSliderValuesChange}
                        />
                    </View>
                </View>
                <View style={styles.filterBottomRowContainer}>
                    {this.renderTags()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    filterContainer: {
        marginTop: 10,
        marginLeft: -10,
        marginRight: -10
    },
    filterRowContainerNoBorder: {
        paddingLeft: 20,
        paddingRight: 20
    },
    filterRowContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.separatorColor,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10
    },
    filterBottomRowContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.separatorColor,
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 10,
        paddingRight: 10
    },
    filterTagsContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'row'
    },
    filterTitle: {
        color: colors.separatorColor
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
        alignSelf: 'center',
        color: colors.whiteColor
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
        color: colors.whiteColor
    },
    filterSwitchText: {
        fontWeight: 'bold',
        color: colors.separatorColor,
        marginBottom: 5,
        marginLeft: 20,
        marginTop: 5,
        alignSelf: 'center',
        textAlign: 'center'
    },
    filterTag: {
        flex: 1,
        padding: 2,
        minHeight: 40,
        marginTop: 10,
        borderColor: colors.activeTabColor,
        borderRadius: 2,
        borderWidth: 1,
        marginLeft: 1,
        marginRight: 1,
        backgroundColor: colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedFilterTag: {
        flex: 1,
        padding: 2,
        marginTop: 10,
        minHeight: 40,
        borderColor: colors.whiteColor,
        borderRadius: 2,
        borderWidth: 1,
        marginLeft: 1,
        marginRight: 1,
        backgroundColor: colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterTagText: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 10,
        color: colors.whiteColor
    },
    selectedFilterTagText: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 10,
        color: colors.backgroundColor
    }
});