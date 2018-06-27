import React, {Component} from 'react';
import {Platform, Slider, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {hasDrawer} from '../navigation/NavigationConfiguration';
import ModalScreen from '../components/Modal';
import geolib from 'geolib';
import {strings} from '../shared/i18n';

class HeaderScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            ...this.getInitialFilterState()
        };
    }

    getInitialFilterState = () => {
        return {
            filterRefundSliderValue: this.props.state.filterRefundSliderValue,
            filterDistanceSliderValue: this.props.state.filterDistanceSliderValue
        };
    };

    onFilterPress = () => {
        this.setState({
            ...this.getInitialFilterState()
        });
        this.props.actions.openModal('filterModal');
    };

    closeFilterModal = () => {
        this.props.actions.closeModal('filterModal');
    };

    changeSliderValues = () => {
        this.closeFilterModal();
        this.props.actions.changeFilterRefundSliderValue(this.state.filterRefundSliderValue);
        this.props.actions.changeFilterDistanceSliderValue(this.state.filterDistanceSliderValue);
    };

    distanceSliderValuesChange = (values) => {
        this.setState({
            filterDistanceSliderValue: values
        });
    };

    refundSliderValuesChange = (values) => {
        this.setState({
            filterRefundSliderValue: values
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

    openSignOutModal = () => {
        this.props.actions.openModal('signOutModal');
    };

    closeSignOutModal = () => {
        this.props.actions.closeModal('signOutModal');
    };

    onSignOut = () => {
        this.props.actions.closeModal('signOutModal');
        this.props.actions.logout();
    };

    render() {
        const {navigation, refundCases, user} = this.props.state;
        const isMerchant = user.isMerchant;

        let displayFilter = navigation.currentRoute === 'Stores' && !navigation.isMap;
        let isOverview = navigation.currentRoute === 'Overview';
        let displayHelp = !displayFilter && refundCases.length > 0;

        let distanceValue = this.getDistanceSliderValue(this.state.filterDistanceSliderValue);

        return (
            <View style={[styles.container, isOverview ? styles.noElevation : {}]}>
                {isMerchant &&
                <View style={styles.noDrawerHeader}>
                </View>
                }
                {hasDrawer && !isMerchant &&
                <TouchableOpacity style={styles.headerButton} onPress={this.props.actions.toggleDrawer}>
                    <Icon name='bars' style={styles.drawerIcon}/>
                </TouchableOpacity>
                }
                {!hasDrawer && !isMerchant &&
                <TouchableOpacity style={styles.noDrawerHeader}
                                  onPress={this.props.actions.navigateSettings}>
                    <Icon name='user-circle' style={hasDrawer ? styles.drawerIcon : styles.noDrawerIcon}/>
                </TouchableOpacity>
                }
                {navigation.currentRoute !== 'Stores' &&
                <Text style={styles.headerText}>Refundeo</Text>
                }
                {navigation.currentRoute === 'Stores' &&
                <View style={styles.overlayContainer}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.props.actions.navigateStoreMap}
                        style={[styles.leftOverlayButton, navigation.isMap ? styles.activeButton : {}]}>
                        <Icon name='map'
                              style={[styles.overlayButtonText, navigation.isMap ? styles.activeOverlayButtonText : {}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.props.actions.navigateStoreList}
                        style={[styles.rightOverlayButton, !navigation.isMap ? styles.activeButton : {}]}>
                        <Icon name='list'
                              style={[styles.overlayButtonText, !navigation.isMap ? styles.activeOverlayButtonText : {}]}/>
                    </TouchableOpacity>
                </View>
                }
                {displayFilter &&
                <TouchableOpacity onPress={this.onFilterPress}
                                  style={hasDrawer ? styles.headerButton : styles.noDrawerHeader}>
                    <Icon name='filter' style={hasDrawer ? styles.drawerIcon : styles.noDrawerIcon}/>
                </TouchableOpacity>
                }
                {displayHelp &&
                <TouchableOpacity style={hasDrawer ? styles.headerButton : styles.noDrawerHeader}
                                  onPress={this.props.actions.navigateHelp}>
                    <Icon name='question-circle' style={hasDrawer ? styles.drawerIcon : styles.noDrawerIcon}/>
                </TouchableOpacity>
                }
                {!displayFilter && !displayHelp && !isMerchant &&
                <View style={styles.noDrawerHeader}>
                </View>
                }
                {isMerchant &&
                <TouchableOpacity style={styles.noDrawerHeader}
                                  onPress={this.openSignOutModal}>
                    <Icon name='sign-out' style={styles.noDrawerIcon}/>
                </TouchableOpacity>
                }
                <ModalScreen
                    modalTitle={strings('settings.sign_out_title')}
                    onSubmit={this.onSignOut}
                    onBack={this.closeSignOutModal}
                    onCancel={this.closeSignOutModal}
                    visible={this.props.state.navigation.modal['signOutModal'] || false}/>
                <ModalScreen
                    modalTitle={strings('stores.filter')}
                    onSubmit={this.changeSliderValues}
                    onBack={this.closeFilterModal}
                    onCancel={this.closeFilterModal}
                    visible={this.props.state.navigation.modal['filterModal'] || false}>
                    <View style={styles.filterContainer}>
                        <View style={styles.filterRowContainer}>
                            <Text style={styles.filterTitle}>
                                {strings('stores.distance')}
                            </Text>
                            <Text style={styles.filterSliderText}>
                                {distanceValue}
                            </Text>
                            <View style={styles.filterSliderContainer}>
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
                </ModalScreen>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: Platform.OS === 'ios' ? 19 : 11,
        paddingBottom: Platform.OS === 'ios' ? 10 : 11,
        elevation: 1
    },
    headerText: {
        fontSize: Platform.OS === 'ios' ? 17 : 18,
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor,
        fontWeight: 'bold'
    },
    headerButton: {
        height: 35,
        width: 35,
        borderRadius: 100,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.activeTabColor
    },
    noDrawerHeader: {
        height: 35,
        width: 35,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawerIcon: {
        fontSize: Platform.OS === 'ios' ? 20 : 15,
        height: undefined,
        width: undefined,
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.backgroundColor
    },
    noDrawerIcon: {
        fontSize: Platform.OS === 'ios' ? 20 : 25,
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    overlayContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    noElevation: {
        elevation: 0
    },
    leftOverlayButton: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingRight: 30,
        paddingLeft: 30,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderWidth: Platform.OS === 'ios' ? 2 : StyleSheet.hairlineWidth,
        borderColor: Platform.OS === 'ios' ? colors.backgroundColor : colors.blackColor,
        backgroundColor: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor
    },
    rightOverlayButton: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 30,
        paddingRight: 30,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: Platform.OS === 'ios' ? 2 : StyleSheet.hairlineWidth,
        borderColor: Platform.OS === 'ios' ? colors.backgroundColor : colors.blackColor,
        backgroundColor: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor
    },
    activeButton: {
        backgroundColor: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    overlayButtonText: {
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor,
        fontSize: 15
    },
    activeOverlayButtonText: {
        color: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor
    },
    filterContainer: {
        margin: 20
    },
    filterRowContainer: {},
    filterTitle: {
        color: colors.darkTextColor
    },
    filterSliderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%'
    },
    filterSlider: {
        width: '100%'
    },
    filterSliderText: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 10,
        alignSelf: 'center'
    },
    filterMarkerStyle: {
        backgroundColor: colors.activeTabColor
    },
    filterTrackStyle: {
        backgroundColor: colors.activeTabColor,
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
            ...state.refundReducer,
            ...state.merchantReducer,
            ...state.authReducer
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
)(HeaderScreen);