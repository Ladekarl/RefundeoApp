import React from 'react';
import {View, StyleSheet, Text, Slider, Switch, Platform, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import Icon from 'react-native-fa-icons';
import geolib from 'geolib';

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
        const chunkSize = 5;
        const filterTagValue = this.state.filterTagValue;


        for (let i = 0; i < arrayLength; i += chunkSize) {
            const chunk = tags.slice(i, i + chunkSize > arrayLength ? arrayLength : i + chunkSize);
            renderedTags.push(
                <View style={styles.filterTagsContainer} key={Math.random()}>
                    {
                        chunk.map(t =>
                            <TouchableOpacity
                                style={filterTagValue.key === t.key ? styles.selectedFilterTag : styles.filterTag}
                                key={t.key}
                                onPress={() => this.onTagPress(t)}>
                                <Text
                                    style={filterTagValue.key === t.key ? styles.selectedFilterTagText : styles.filterTagText}>{this.getTagText(t)}</Text>
                            </TouchableOpacity>)
                    }
                </View>
            );
        }
        return renderedTags;
    };

    getTagText = (tag) => {
        const key = tag.key;
        switch (key) {
            case 0:
                return strings('stores.tag_jewelry');
            case 1:
                return strings('stores.tag_clothes');
            case 2:
                return strings('stores.tag_footwear');
            case 3:
                return strings('stores.tag_accessories');
            case 4:
                return strings('stores.tag_sportswear');
            case 5:
                return strings('stores.tag_technology');
            case 6:
                return strings('stores.tag_children');
            case 7:
                return strings('stores.tag_books');
            case 8:
                return strings('stores.tag_department');
        }
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
        borderColor: colors.activeTabColor,
        borderRadius: 2,
        borderWidth: 1,
        marginLeft: 1,
        marginRight: 1,
        backgroundColor: colors.activeTabColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterTagText: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 10,
        color: colors.activeTabColor
    },
    selectedFilterTagText: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 10,
        color: colors.whiteColor
    }
});