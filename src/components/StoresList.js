import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import StoreListItem from './StoreListItem';
import Location from '../shared/Location';
import geolib from 'geolib';

export default class StoresList extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        merchants: PropTypes.array.isRequired,
        fetching: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            doneCalculating: false
        };
    }

    componentDidMount() {
        this.updateDistances();
    }

    updateDistances = () => {
        if (this.props.merchants && this.props.merchants.length > 0) {
            Location.getCurrentPosition(this.calculateDistances);
        }
    };

    calculateDistances = (location) => {
        const merchants = this.props.merchants;
        for (let merchant of merchants) {
            merchant.distance = geolib.getDistance(location.coords, {
                latitude: merchant.latitude,
                longitude: merchant.longitude
            }, 100);
        }
        this.setState({doneCalculating: true});
    };

    render() {
        const {merchants, fetching, actions} = this.props;
        const {doneCalculating} = this.state;

        return (
            <ScrollView
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        tintColor={colors.activeTabColor}
                        refreshing={fetching || !doneCalculating}
                        onRefresh={actions.getMerchants}
                    />
                }>
                {merchants.map((merchant, i) => {
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