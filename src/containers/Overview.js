import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
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
            <Icon name='home' style={[styles.tabBarIcon, {color: tintColor}]}/>),
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

    render() {
        const {actions, state} = this.props;
        const {refundCases, fetchingRefundCases} = state;

        return (
            <LinearGradient colors={[colors.activeTabColor, colors.gradientColor]} style={styles.linearGradient}>
                <ScrollView
                    style={[styles.container, refundCases && refundCases.length > 0 ? styles.refundCasesContainer : {}]}
                    contentContainerStyle={[styles.scrollContainer, refundCases && refundCases.length > 0 ? styles.refundCasesContainer : {}]}
                    refreshControl={
                        <RefreshControl
                            refreshing={fetchingRefundCases}
                            onRefresh={actions.getRefundCases}
                        />
                    }>
                    {!fetchingRefundCases && refundCases.length === 0 &&
                    <EmptyOverviewScreen actions={actions}/>
                    }
                    {refundCases.map((refundCase, i) => (
                        // TODO: List all refund cases and open refundcasescreen on click
                        <RefundCaseScreen key={i} actions={actions} refundCase={refundCase}/>
                    ))}
                </ScrollView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    refundCasesContainer: {
        backgroundColor: 'transparent'
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'space-between',
        padding: 10
    },
    tabBarIcon: {
        fontSize: 20
    },
    linearGradient: {
        flex: 1,
        backgroundColor: colors.backgroundColor
    }
});

const mapStateToProps = state => {
    return {
        state: {
            ...state.refundReducer
        }
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OverviewScreen);