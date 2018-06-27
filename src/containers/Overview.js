import React, {Component} from 'react';
import {RefreshControl, StyleSheet, View, FlatList, Text, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import EmptyOverviewScreen from '../components/EmptyOverview';
import RefundCaseListItem from '../components/RefundCaseListItem';
import {strings} from '../shared/i18n';

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
        this.state = {
            page: 0
        };
    }

    _renderRefundCase = ({item}) => (
        <RefundCaseListItem refundCase={item} onPress={this.props.actions.selectRefundCase}
                            onIconPress={this.handleIconPressed}/>
    );

    _keyExtractor = (refundCase) => refundCase.id.toString();

    _renderSeparator = () => {
        return (
            <View
                style={styles.separatorStyle}
            />
        );
    };

    onFirstPress = () => {
        this.changePage(0);
    };
    onSecondPress = () => {
        this.changePage(1);
    };
    onThirdPress = () => {
        this.changePage(2);
    };
    onFourthPress = () => {
        this.changePage(3);
    };
    changePage = (page) => {
        this.setState({
            page
        });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const refundCases = nextProps.state.refundCases;
        if (!prevState || !prevState.state || refundCases !== prevState.state.refundCases) {
            return {
                ...nextProps,
                newRefundCases: refundCases.filter(r => !r.isRequested),
                pendingRefundCases: refundCases.filter(r => r.isRequested && !r.isAccepted && !r.isRejected),
                approvedRefundCases: refundCases.filter(r => r.isRequested && r.isAccepted),
                rejectedRefundCases: refundCases.filter(r => r.isRequested && r.isRejected)
            };
        }
        return null;
    }

    getFilteredRefundCases = () => {
        const page = this.state.page;
        if (page === 0) return this.state.newRefundCases;
        if (page === 1) return this.state.pendingRefundCases;
        if (page === 2) return this.state.approvedRefundCases;
        if (page === 3) return this.state.rejectedRefundCases;
    };

    emptyListScreen = () => {
        if (!this.props.state.refundCases || this.props.state.refundCases.length === 0)
            return <EmptyOverviewScreen actions={this.props.actions}/>;
        const page = this.state.page;
        let text = strings('overview.no_new');
        if (page === 1)
            text = strings('overview.no_pending');
        if (page === 2)
            text = strings('overview.no_approved');
        if (page === 3)
            text = strings('overview.no_rejected');
        return <View style={styles.emptyContentContainer}><Text style={styles.emptyText}>{text}</Text></View>;
    };

    render() {
        const {actions, state} = this.props;
        const {refundCases, fetchingRefundCases, fetchingDocumentation, fetchingRequestRefund} = state;

        const filteredRefundCases = this.getFilteredRefundCases();

        return (
            <View style={styles.container}>
                {refundCases && refundCases.length > 0 &&
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        onPress={this.onFirstPress}
                        style={[styles.headerButton, this.state.page === 0 ? styles.activeButton : {}]}>
                        <Text
                            style={[styles.headerButtonText, this.state.page === 0 ? styles.activeButtonText : {}]}>
                            {strings('overview.new')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onSecondPress}
                        style={[styles.headerButton, this.state.page === 1 ? styles.activeButton : {}]}>
                        <Text
                            style={[styles.headerButtonText, this.state.page === 1 ? styles.activeButtonText : {}]}>
                            {strings('overview.pending')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onThirdPress}
                        style={[styles.headerButton, this.state.page === 2 ? styles.activeButton : {}]}>
                        <Text
                            style={[styles.headerButtonText, this.state.page === 2 ? styles.activeButtonText : {}]}>
                            {strings('overview.approved')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onFourthPress}
                        style={[styles.headerButton, this.state.page === 3 ? styles.activeButton : {}]}>
                        <Text
                            style={[styles.headerButtonText, this.state.page === 3 ? styles.activeButtonText : {}]}>
                            {strings('overview.rejected')}
                        </Text>
                    </TouchableOpacity>
                </View>
                }
                <FlatList
                    style={styles.flatListContainer}
                    contentContainerStyle={[styles.scrollContainer, filteredRefundCases.length === 0 ? styles.emptyContainer : styles.nonEmptyContainer]}
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.activeTabColor}
                            refreshing={fetchingRefundCases || fetchingDocumentation || fetchingRequestRefund}
                            onRefresh={actions.getRefundCases}
                        />
                    }
                    data={refundCases && refundCases.length > 0 ? filteredRefundCases : null}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderRefundCase}
                    ListEmptyComponent={!fetchingRefundCases && (!filteredRefundCases || !filteredRefundCases.length > 0) ?
                        this.emptyListScreen() : undefined}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor
    },
    headerContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor,
        marginTop: -10,
        elevation: 1
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor,
    },
    activeButton: {
        borderBottomWidth: 2,
        borderBottomColor: Platform.OS === 'ios' ? colors.whiteColor : colors.activeTabColor,
    },
    headerButtonText: {
        fontSize: 11,
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.darkTextColor,
        fontWeight: 'bold'
    },
    activeButtonText: {
        fontSize: 12,
        color: Platform.OS === 'ios' ? colors.whiteColor : colors.activeTabColor,
        fontWeight: 'bold'
    },
    flatListContainer: {
        backgroundColor: colors.slightlyDarkerColor,
    },
    scrollContainer: {
        backgroundColor: colors.backgroundColor,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: colors.backgroundColor
    },
    nonEmptyContainer: {
        paddingTop: 4,
        backgroundColor: colors.slightlyDarkerColor
    },
    tabBarIcon: {
        fontSize: 20
    },
    emptyContentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundColor
    },
    emptyText: {
        alignSelf: 'center',
        color: colors.activeTabColor,
        fontSize: 20
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
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
;