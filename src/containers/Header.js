import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {hasDrawer} from '../navigation/NavigationConfiguration';
import ModalScreen from '../components/Modal';
import {strings} from '../shared/i18n';
import StoreFilter from '../components/StoreFilter';

class HeaderScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    onFilterPress = () => {
        this.props.actions.openModal('filterModal');
    };

    closeFilterModal = () => {
        this.props.actions.closeModal('filterModal');
    };

    changeFilterValues = () => {
        this.closeFilterModal();
        const distanceValue = this.storeFilter.getDistanceValue();
        const refundValue = this.storeFilter.getRefundSliderValue();
        const onlyOpenValue = this.storeFilter.getOnlyOpenValue();
        const filterTag = this.storeFilter.getFilterTagValue();
        this.props.actions.changeFilterValues(distanceValue, refundValue, onlyOpenValue, filterTag);
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
        let isRefundCaseView = isOverview && refundCases.length > 0;

        return (
            <View style={[styles.container, isRefundCaseView ? styles.noElevation : {}]}>
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
                    onSubmit={this.changeFilterValues}
                    onBack={this.closeFilterModal}
                    onCancel={this.closeFilterModal}
                    visible={this.props.state.navigation.modal['filterModal'] || false}>
                    <StoreFilter
                        filterDistanceSliderValue={this.props.state.filterDistanceSliderValue}
                        filterRefundSliderValue={this.props.state.filterRefundSliderValue}
                        filterTagValue={this.props.state.filterTag}
                        tags={this.props.state.tags}
                        ref={(ref) => this.storeFilter = ref}
                        filterOnlyOpenValue={this.props.state.filterOnlyOpenValue}
                    />
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
        elevation: 1,
        zIndex: 9999
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