import {TabNavigator} from 'react-navigation';
import OverviewScreen from '../containers/Overview';
import colors from '../shared/colors';
import {Platform} from 'react-native';
import ScannerScreen from '../components/Scanner';

const HomeTab = TabNavigator({
    Overview: {
        screen: OverviewScreen
    },
    Scanner: {
        screen: ScannerScreen
    }
}, {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarOptions: {
        activeTintColor: colors.activeTabColor,
        inactiveTintColor: colors.inactiveTabColor,
        tabStyle: {
            backgroundColor: colors.backgroundColor,
        },
        style: {
            paddingTop: Platform.OS === 'ios' ? 0 : 2,
            paddingBottom: Platform.OS === 'ios' ? 0 : 2,
            backgroundColor: colors.backgroundColor,
            elevation: 1,
            justifyContent: 'center',
            alignItems: 'center'
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