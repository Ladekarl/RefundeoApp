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
import MultiSlider from '@ptomasroos/react-native-multi-slider';

class HeaderScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    onFilterPress = () => {
        this.props.actions.openModal('filterModal');
    };

    closeFilterModal = () => {
        this.props.actions.closeModal('filterModal');
    };

    distanceSliderValuesChange = (values) => {
        this.props.actions.changeFilterDistanceSliderValue(values);
    };

    refundSliderValuesChange = (values) => {
        this.props.actions.changeFilterRefundSliderValue(values);
    };


    render() {
        const {navigation, refundCases, filterDistanceSliderValue, filterRefundSliderValue} = this.props.state;

        let displayFilter = navigation.currentRoute === 'Stores' && !navigation.isMap;
        let displayHelp = navigation.currentRoute === 'Overview' && refundCases.length > 0;

        let maxValue = filterDistanceSliderValue[1];
        if (filterDistanceSliderValue[1] === 10000) {
            maxValue = 'unlimited';
        }

        return (
            <View style={styles.container}>
                {hasDrawer &&
                <TouchableOpacity style={styles.headerButton} onPress={this.props.actions.toggleDrawer}>
                    <Icon name='bars' style={styles.drawerIcon}/>
                </TouchableOpacity>
                }
                {!hasDrawer &&
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
                {!displayFilter && !displayHelp &&
                <View style={styles.noDrawerHeader}>
                </View>
                }
                <ModalScreen
                    modalTitle={'Filter'}
                    onSubmit={this.closeFilterModal}
                    onBack={this.closeFilterModal}
                    onCancel={this.closeFilterModal}
                    visible={this.props.state.navigation.modal['filterModal'] || false}>
                    <View style={styles.filterContainer}>
                        <View style={styles.filterRowContainer}>
                            <Text style={styles.filterTitle}>
                                Distance (m)
                            </Text>
                            <Text style={styles.filterSliderText}>
                                {filterDistanceSliderValue[0] + ' - ' + maxValue}
                            </Text>
                            <View style={styles.filterSlider}>
                                <MultiSlider
                                    values={filterDistanceSliderValue}
                                    min={0}
                                    max={10000}
                                    step={100}
                                    allowOverlap={false}
                                    onValuesChange={this.distanceSliderValuesChange}
                                />
                            </View>

                        </View>
                        <View style={styles.filterRowContainer}>
                            <Text style={styles.filterTitle}>
                                Refund percantage
                            </Text>
                            <Text style={styles.filterSliderText}>
                                {filterRefundSliderValue[0] + ' - ' + filterRefundSliderValue[1]}</Text>
                            <View style={styles.filterSlider}>
                                <MultiSlider
                                    values={filterRefundSliderValue}
                                    min={0}
                                    max={100}
                                    step={1}
                                    allowOverlap={false}
                                    onValuesChange={this.refundSliderValuesChange}

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
    filterSlider: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    filterSliderText: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 10,
        alignSelf: 'center'
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
            ...state.refundReducer,
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
)(HeaderScreen);