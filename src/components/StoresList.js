import React, {Component} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import StoreListItem from './StoreListItem';

export default class StoresList extends Component {

    static propTypes = {
      actions: PropTypes.object.isRequired
    };

    render() {
        return (
            <ScrollView style={styles.scrollContainer}>
                <StoreListItem
                 distance={712}
                 logo={require('../../assets/refundeo_banner_small.png')}
                 banner={require('../../assets/example-store.jpg')}
                 name='Example Store'
                 openingHours='09:00 - 21:30'
                 refundPercentage={75}
                 onPress={this.props.actions.navigateStoreProfile}/>
                <StoreListItem
                    distance={925}
                    logo={require('../../assets/refundeo_banner_small.png')}
                    banner={require('../../assets/example-store.jpg')}
                    name='Example store'
                    openingHours='09:00 - 21:30'
                    refundPercentage={75}
                    onPress={this.props.actions.navigateStoreProfile}/>
                <StoreListItem
                    distance={1574}
                    logo={require('../../assets/refundeo_banner_small.png')}
                    banner={require('../../assets/example-store.jpg')}
                    name='Example store'
                    openingHours='09:00 - 21:30'
                    refundPercentage={75}
                    onPress={this.props.actions.navigateStoreProfile}/>
                <StoreListItem
                    distance={14523}
                    logo={require('../../assets/refundeo_banner_small.png')}
                    banner={require('../../assets/example-store.jpg')}
                    name='Example store'
                    openingHours='09:00 - 21:30'
                    refundPercentage={75}
                    onPress={this.props.actions.navigateStoreProfile}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: colors.separatorColor,
    }
});