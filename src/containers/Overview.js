import React, {Component} from 'react';
import {RefreshControl, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import RefundCaseListItem from '../components/RefundCaseListItem';
import {strings} from '../shared/i18n';
import CustomText from '../components/CustomText';
import Swiper from 'react-native-swiper';

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
            page: 0,
            index: 0
        };
    }

    static _renderRefundCase = ({item}) => (
        <RefundCaseListItem refundCase={item} onPress={this.props.actions.selectRefundCase}/>
    );

    static _keyExtractor = (refundCase) => refundCase.id.toString();

    static onFirstPress = () => {
        OverviewScreen.changePage(0);
    };
    static onSecondPress = () => {
        OverviewScreen.changePage(1);
    };
    static onThirdPress = () => {
        OverviewScreen.changePage(2);
    };
    static onFourthPress = () => {
        OverviewScreen.changePage(3);
    };
    static changePage = (newPage) => {
        const swiper = OverviewScreen.getSwiper();
        if (typeof swiper !== 'undefined') {
            const index = swiper.state && typeof swiper.state.index !== 'undefined' ? swiper.state.index : 0;
            swiper.scrollBy(newPage - index, true);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState || !prevState.state || nextProps.state !== prevState.state) {
            let changed = true;
            let {fetchingRefundCases, fetchingDocumentation, fetchingRequestRefund, refundCases} = nextProps.state;

            if (prevState && prevState.state) {
                let prevFetchingRefundCases = prevState.state.fetchingRefundCases,
                    prevFetchingDocumentation = prevState.state.fetchingDocumentation,
                    prevFetchingRequestRefund = prevState.state.fetchingRequestRefund,
                    prevRefundCases = prevState.state.refundCases;

                changed = fetchingRefundCases !== prevFetchingRefundCases ||
                    fetchingDocumentation !== prevFetchingDocumentation ||
                    fetchingRequestRefund !== prevFetchingRequestRefund ||
                    refundCases !== prevRefundCases;
            }

            let {
                newRefundCases,
                pendingRefundCases,
                approvedRefundCases,
                rejectedRefundCases,
                newRefundCasesList,
                pendingRefundCasesList,
                approvedRefundCasesList,
                rejectedRefundCasesList
            } = prevState;

            if (!prevState || !prevState.state || refundCases !== prevState.state.refundCases) {
                newRefundCases = refundCases.filter(r => !r.isRequested);
                pendingRefundCases = refundCases.filter(r => r.isRequested && !r.isAccepted && !r.isRejected);
                approvedRefundCases = refundCases.filter(r => r.isRequested && r.isAccepted);
                rejectedRefundCases = refundCases.filter(r => r.isRequested && r.isRejected);
            }

            if (changed) {
                newRefundCasesList = OverviewScreen.renderList(0, newRefundCases, nextProps);
                pendingRefundCasesList = OverviewScreen.renderList(1, pendingRefundCases, nextProps);
                approvedRefundCasesList = OverviewScreen.renderList(2, approvedRefundCases, nextProps);
                rejectedRefundCasesList = OverviewScreen.renderList(3, rejectedRefundCases, nextProps);
            }

            return {
                ...nextProps,
                newRefundCasesList,
                pendingRefundCasesList,
                approvedRefundCasesList,
                rejectedRefundCasesList,
                newRefundCases,
                pendingRefundCases,
                approvedRefundCases,
                rejectedRefundCases
            };
        }
        return null;
    }

    static emptyListScreen = (page) => {
        let text = strings('overview.no_new');
        if (page === 1)
            text = strings('overview.no_pending');
        if (page === 2)
            text = strings('overview.no_approved');
        if (page === 3)
            text = strings('overview.no_rejected');
        return <View style={styles.emptyContentContainer}><CustomText
            style={styles.emptyText}>{text}</CustomText></View>;
    };

    static renderHeader = (page) => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={OverviewScreen.onFirstPress}
                    style={[styles.headerButton, page === 0 ? styles.activeButton : {}]}>
                    <CustomText
                        style={[styles.headerButtonText, page === 0 ? styles.activeButtonText : {}]}>
                        {strings('overview.new')}
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={OverviewScreen.onSecondPress}
                    style={[styles.headerButton, page === 1 ? styles.activeButton : {}]}>
                    <CustomText
                        style={[styles.headerButtonText, page === 1 ? styles.activeButtonText : {}]}>
                        {strings('overview.pending')}
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={OverviewScreen.onThirdPress}
                    style={[styles.headerButton, page === 2 ? styles.activeButton : {}]}>
                    <CustomText
                        style={[styles.headerButtonText, page === 2 ? styles.activeButtonText : {}]}>
                        {strings('overview.approved')}
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={OverviewScreen.onFourthPress}
                    style={[styles.headerButton, page === 3 ? styles.activeButton : {}]}>
                    <CustomText
                        style={[styles.headerButtonText, page === 3 ? styles.activeButtonText : {}]}>
                        {strings('overview.rejected')}
                    </CustomText>
                </TouchableOpacity>
            </View>);
    };

    static renderList = (page, refundCases, props) => {
        const {actions, state} = props;
        const {fetchingRefundCases, fetchingDocumentation, fetchingRequestRefund} = state;
        const fetching = fetchingRefundCases || fetchingDocumentation || fetchingRequestRefund;

        return <FlatList
            style={styles.flatListContainer}
            contentContainerStyle={[styles.scrollContainer, refundCases.length === 0 ? styles.emptyContainer : styles.nonEmptyContainer]}
            refreshControl={
                <RefreshControl
                    tintColor={colors.activeTabColor}
                    refreshing={fetching}
                    onRefresh={actions.getRefundCases}
                />
            }
            data={refundCases}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderRefundCase}
            ListEmptyComponent={!fetchingRefundCases && (!refundCases || !refundCases.length > 0) ?
                OverviewScreen.emptyListScreen(page) : undefined}
        />;
    };

    static swiper: Swiper;

    static getSwiper() {
        return OverviewScreen.swiper;
    }

    static setSwiper(swiper) {
        OverviewScreen.swiper = swiper;
    }

    onMomentumScrollEnd = (event, state) => {
        const swiper = OverviewScreen.getSwiper();
        if (typeof swiper !== 'undefined') {
            this.setState({page: state.index});
        }
    };

    render() {
        const {
            newRefundCasesList,
            pendingRefundCasesList,
            approvedRefundCasesList,
            rejectedRefundCasesList,
            page
        } = this.state;
        return (
            <View style={styles.container}>
                {OverviewScreen.renderHeader(page)}
                {newRefundCasesList && pendingRefundCasesList && approvedRefundCasesList && rejectedRefundCasesList &&
                <Swiper
                    ref={OverviewScreen.setSwiper}
                    loop={false}
                    autoplay={false}
                    showsButtons={false}
                    showsPagination={false}
                    index={page}
                    onMomentumScrollEnd={this.onMomentumScrollEnd}>
                    {newRefundCasesList}
                    {pendingRefundCasesList}
                    {approvedRefundCasesList}
                    {rejectedRefundCasesList}
                </Swiper>
                }
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
        backgroundColor: colors.backgroundColor,
        marginTop: -10,
        elevation: 1
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: colors.backgroundColor,
    },
    activeButton: {
        borderBottomWidth: 2,
        borderBottomColor: colors.activeTabColor,
    },
    headerButtonText: {
        fontSize: 11,
        color: colors.whiteColor,
        fontWeight: 'bold'
    },
    activeButtonText: {
        fontSize: 12,
        color: colors.activeTabColor,
        fontWeight: 'bold'
    },
    flatListContainer: {
        backgroundColor: colors.slightlyDarkerColor,
    },
    scrollContainer: {
        backgroundColor: colors.slightlyDarkerColor,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: colors.slightlyDarkerColor,
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
        backgroundColor: colors.slightlyDarkerColor
    },
    emptyText: {
        alignSelf: 'center',
        color: colors.backgroundColor,
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