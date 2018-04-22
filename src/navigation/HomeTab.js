import React from 'react';
import {TabNavigator} from 'react-navigation';
import OverviewScreen from '../components/Overview';
import colors from '../shared/colors';
import {Platform} from 'react-native';

export default HomeTab = TabNavigator({
    Overview: {
        screen: OverviewScreen
    }
}, {
    animationEnabled: true,
    tabBarOptions: {
        activeTintColor: colors.activeTabColor,
        inactiveTintColor: colors.inactiveTabColor,
        tabStyle: {
            backgroundColor: colors.backgroundColor,
        },
        style: {
            paddingTop: Platform.OS === 'ios' ? 20 : 2,
            paddingBottom: Platform.OS === 'ios' ? 20 : 2,
            backgroundColor: colors.backgroundColor,
            elevation: 1,
        },
        labelStyle: {
            display: 'none'
        },
        indicatorStyle: {
            opacity: 0
        },
        showIcon: true,
    }
});