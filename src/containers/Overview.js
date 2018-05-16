import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import EmptyOverviewScreen from '../components/EmptyOverview';
import RefundCaseScreen from '../components/RefundCase';

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
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={state.fetchingRefundCases}
                        onRefresh={actions.getRefundCases}
                    />
                }>
                {!state.fetchingRefundCases && state.refundCases.length === 0 &&
                <EmptyOverviewScreen actions={actions}/>
                }
                {state.refundCases.map((key, refundCase) => (
                    // TODO: List all refund cases and open refundcasescreen on click
                    <RefundCaseScreen key={key} actions={actions} refundCase={refundCase}/>
                ))}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'space-between',
        padding: 10
    },
    tabBarIcon: {
        fontSize: 20
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