import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, Platform} from 'react-native';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import EmptyOverviewScreen from '../components/EmptyOverview';
import RefundCaseScreen from '../components/RefundCase';
import LinearGradient from 'react-native-linear-gradient';

class OverviewScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        tabBarIcon: ({tintColor}) => (
            <Icon name='list' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    navigateScanner = () => {
        this.props.actions.navigateScanner();
    };

    getLinearGradientColors = () => {
        return Platform.OS === 'ios' ? [colors.activeTabColor, colors.gradientColor] : [colors.whiteColor, colors.backgroundColor, colors.slightlyDarkerColor];
    };

    render() {
        const {actions, state} = this.props;
        const {refundCases, fetchingRefundCases} = state;

        return (
            <LinearGradient colors={this.getLinearGradientColors()} style={styles.linearGradient}>
                <ScrollView
                    style={styles.container}
                    indicatorStyle={Platform.OS === 'ios' ? 'white' : 'black'}
                    contentContainerStyle={styles.scrollContainer}
                    refreshControl={
                        <RefreshControl
                            tintColor={Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor}
                            refreshing={fetchingRefundCases}
                            onRefresh={actions.getRefundCases}
                        />
                    }>
                    {!fetchingRefundCases && refundCases.length === 0 &&
                    <EmptyOverviewScreen actions={actions}/>
                    }
                    {refundCases.map((refundCase, i) => (
                        <RefundCaseScreen key={i} actions={actions} refundCase={refundCase}/>
                    ))}
                </ScrollView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    tabBarIcon: {
        fontSize: 20
    },
    linearGradient: {
        flex: 1
    }
});

const mapStateToProps = state => {
    return {
        state: {
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
)(OverviewScreen);