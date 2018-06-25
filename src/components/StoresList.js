import React, {PureComponent} from 'react';
import {RefreshControl, FlatList, StyleSheet, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import StoreListItem from './StoreListItem';
import EmptyStoreList from './EmptyStoreList';

export default class StoresList extends PureComponent {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        merchants: PropTypes.array.isRequired,
        fetching: PropTypes.bool.isRequired,
        refundMin: PropTypes.number.isRequired,
        refundMax: PropTypes.number.isRequired,
        distanceMin: PropTypes.number.isRequired,
        distanceMax: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
    }

    filterMerchants = () => {
        const {merchants, distanceMax, distanceMin, refundMax, refundMin} = this.props;
        let filteredMerchants = [];
        merchants.forEach((merchant) => {
            const dist = merchant.distance;
            const ref = 95 - merchant.refundPercentage;
            if (dist >= distanceMin && (dist <= distanceMax || distanceMax === 10000) && ref >= refundMin && ref <= refundMax) {
                filteredMerchants.push(merchant);
            }
        });
        return filteredMerchants;
    };

    renderStoreListItem = ({item}) => {
        return (<StoreListItem
            distance={item.distance}
            key={item.id}
            logo={item.logo}
            banner={item.banner}
            name={item.companyName}
            openingHours={item.openingHours}
            refundPercentage={item.refundPercentage}
            onPress={() => this.props.actions.selectMerchant(item)}
            city={item.addressCity}
        />);
    };

    keyExtractor = (merchant) => merchant.id.toString();

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
        backgroundColor: colors.slightlyDarkerColor,
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