import React, {Component} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import StoreListItem from './StoreListItem';

export default class StoresList extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        merchants: PropTypes.array.isRequired
    };

    render() {
        const {merchants} = this.props;

        return (
            <ScrollView style={styles.scrollContainer}>
                {merchants.map((merchant, i) => {
                    return <StoreListItem
                        distance={712}
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