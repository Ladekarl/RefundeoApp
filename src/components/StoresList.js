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
        minRefund: PropTypes.number.isRequired,
        distance: PropTypes.number.isRequired,
        onlyOpen: PropTypes.bool.isRequired,
        tag: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    filterMerchants = () => {
        const {merchants, distance, minRefund, onlyOpen, tag} = this.props;
        let filteredMerchants = [];
        const currentDate = new Date();
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentDay = currentDate.getDay();
        merchants.forEach((merchant) => {
            const dist = merchant.distance;
            if ((dist <= distance || distance === 10000) && (minRefund === 0 || merchant.refundPercentage >= minRefund) && (!tag.value || merchant.tags.findIndex(t => t.value === tag.value) > -1)) {
                if (onlyOpen) {
                    const openingHours = merchant.openingHours.find(o => o.day === currentDay);
                    if (openingHours && openingHours.open && openingHours.close) {
                        const openStrSplit = openingHours.open.split(':');
                        const closeStrSplit = openingHours.close.split(':');
                        const openHours = parseInt(openStrSplit[0]);
                        const openMinutes = parseInt(openStrSplit[1]);
                        const closeHours = parseInt(closeStrSplit[0]);
                        const closeMinutes = parseInt(closeStrSplit[1]);

                        const isOpenHours = currentHours > openHours || (currentHours === openHours && currentMinutes >= openMinutes);
                        const isCloseHours = currentHours < closeHours || (currentHours === closeHours && currentMinutes <= closeMinutes);

                        if (isOpenHours && isCloseHours) {
                            filteredMerchants.push(merchant);
                        }
                    }
                } else {
                    filteredMerchants.push(merchant);
                }
            }
        });
        return filteredMerchants;
    };

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
        const {fetching, actions} = this.props;

        let filterMerchants = this.filterMerchants();

        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.flatListContainer}
                    contentContainerStyle={filterMerchants.length === 0 ? styles.emptyContainer : {}}
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.activeTabColor}
                            refreshing={fetching}
                            onRefresh={actions.getMerchants}
                        />
                    }
                    ItemSeparatorComponent={this._renderSeparator}
                    data={filterMerchants && filterMerchants.length > 0 ? filterMerchants : null}
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
        flex: 1
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