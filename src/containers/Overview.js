import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Platform, View, FlatList} from 'react-native';
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

    _renderRefundCase = ({item}) => (
        <RefundCaseScreen actions={this.props.actions} refundCase={item}/>
    );

    _keyExtractor = (refundCase) => refundCase.id.toString();

    render() {
        const {actions, state} = this.props;
        const {refundCases, fetchingRefundCases, fetchingDocumentation, fetchingRequestRefund} = state;

        return (
            <LinearGradient colors={this.getLinearGradientColors()} style={styles.linearGradient}>
                <FlatList
                    style={styles.container}
                    contentContainerStyle={[styles.scrollContainer, refundCases.length === 0 ? styles.emptyContainer : {}]}
                    refreshControl={
                        <RefreshControl
                            tintColor={Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor}
                            refreshing={fetchingRefundCases || fetchingDocumentation || fetchingRequestRefund}
                            onRefresh={actions.getRefundCases}
                        />
                    }
                    data={refundCases}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderRefundCase}
                    ListEmptyComponent={!fetchingRefundCases ? <EmptyOverviewScreen actions={actions}/> : undefined}
                />
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    scrollContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1
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