import React, {Component} from 'react';
import {RefreshControl, StyleSheet, View, FlatList} from 'react-native';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import EmptyOverviewScreen from '../components/EmptyOverview';
import RefundCaseListItem from '../components/RefundCaseListItem';

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

    render() {
        const {actions, state} = this.props;
        const {refundCases, fetchingRefundCases, fetchingDocumentation, fetchingRequestRefund} = state;

        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.flatListContainer}
                    contentContainerStyle={[styles.scrollContainer, refundCases.length === 0 ? styles.emptyContainer : {}]}
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.activeTabColor}
                            refreshing={fetchingRefundCases || fetchingDocumentation || fetchingRequestRefund}
                            onRefresh={actions.getRefundCases}
                        />
                    }
                    ItemSeparatorComponent={this._renderSeparator}
                    data={refundCases && refundCases.length > 0 ? refundCases : null}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderRefundCase}
                    ListEmptyComponent={!fetchingRefundCases ? <EmptyOverviewScreen actions={actions}/> : undefined}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flatListContainer: {
        backgroundColor: colors.backgroundColor,
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
    container: {
        flex: 1
    },
    separatorStyle: {
        height: 1,
        backgroundColor: colors.separatorColor,
        marginLeft: 65,
        marginBottom: 5
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