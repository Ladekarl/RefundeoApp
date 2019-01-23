import React, {Component} from 'react';
import {RefreshControl, FlatList, StyleSheet, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import StoreListItem from './StoreListItem';
import EmptyStoreList from './EmptyStoreList';

export default class StoresList extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        merchants: PropTypes.array.isRequired,
        fetching: PropTypes.bool.isRequired,
        distance: PropTypes.number.isRequired,
        tag: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderStoreListItem = ({item}) => {
        return (<StoreListItem
            distance={item.distance}
            key={Math.random()}
            name={item.companyName}
            openingHours={item.openingHours}
            tags={item.tags}
            rating={item.rating}
            address={item.addressStreetName + ' ' + item.addressStreetNumber}
            refundPercentage={item.refundPercentage}
            priceLevel={item.priceLevel}
            onPress={() => this.props.actions.selectMerchant(item)}
        />);
    };

    keyExtractor = (merchant, index) => `stores-list-${index}`;

    _renderSeparator = () => {
        return <View
            style={styles.separatorStyle}
        />;
    };

    render() {
        const {fetching, actions, merchants} = this.props;

        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.flatListContainer}
                    contentContainerStyle={merchants && merchants.length === 0 ? styles.emptyContainer : {}}
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.activeTabColor}
                            refreshing={fetching}
                            onRefresh={actions.getMerchants}
                        />
                    }
                    ItemSeparatorComponent={this._renderSeparator}
                    data={merchants && merchants.length > 0 ? merchants : null}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderStoreListItem}
                    ListEmptyComponent={!fetching ? EmptyStoreList : undefined}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        paddingTop: 20
    },
    flatListContainer: {
        backgroundColor: colors.backgroundColor,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    separatorStyle: {
        margin: 5
    }
});