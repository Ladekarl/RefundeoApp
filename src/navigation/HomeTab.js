import {Platform} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation';
import OverviewScreen from '../containers/Overview';
import colors from '../shared/colors';
import StoresScreen from '../containers/Stores';
import {StyleSheet} from 'react-native';
import QRCode from '../containers/QRCode';

const HomeTab = createBottomTabNavigator({
    Overview: {
        screen: OverviewScreen
    },
    QRCode: {
        screen: QRCode
    },
    Stores: {
        screen: StoresScreen
    }
}, {
    tabBarOptions: {
        activeTintColor: colors.activeTabColor,
        inactiveTintColor: colors.inactiveTabColor,
        lazy: false,
        tabStyle: {
            backgroundColor: colors.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0
        },
        style: {
            height: 50,
            backgroundColor: colors.backgroundColor,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: Platform.OS === 'ios' ? colors.darkTextColor: colors.separatorColor,
            elevation: 1,
            paddingTop: Platform.OS === 'ios' ? 0 : 4
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

export default HomeTab;