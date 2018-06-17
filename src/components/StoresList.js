import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import StoreListItem from './StoreListItem';

export default class StoresList extends Component {

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

    render() {
        const {fetching, actions} = this.props;

        let filterMerchants = this.filterMerchants();

        return (
            <ScrollView
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        tintColor={colors.activeTabColor}
                        refreshing={fetching}
                        onRefresh={actions.getMerchants}
                    />
                }>
                {filterMerchants.map((merchant, i) => {

                    return <StoreListItem
                        distance={merchant.distance ? merchant.distance : 0}
                        key={i}
                        logo={merchant.logo}
                        banner={merchant.banner}
                        name={merchant.companyName}
                        openingHours={merchant.openingHours}
                        refundPercentage={merchant.refundPercentage}
                        onPress={() => this.props.actions.selectMerchant(merchant)}/>;
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: colors.separatorColor,
    }
});