import {TabNavigator} from 'react-navigation';
import OverviewScreen from '../containers/Overview';
import colors from '../shared/colors';
import {Platform} from 'react-native';
import ScannerScreen from '../containers/Scanner';

const HomeTab = TabNavigator({
    Overview: {
        screen: OverviewScreen
    },
    Scanner: {
        screen: ScannerScreen
    }
}, {
    animationEnabled: false,
    swipeEnabled: true,
    lazy: false,
    tabBarOptions: {
        activeTintColor: colors.activeTabColor,
        inactiveTintColor: colors.inactiveTabColor,
        tabStyle: {
            backgroundColor: colors.backgroundColor,
        },
        style: {
            paddingBottom: Platform.OS === 'ios' ? 0 : 2,
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

export default HomeTab;