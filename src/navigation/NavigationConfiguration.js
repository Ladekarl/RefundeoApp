import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import InitialScreen from '../containers/Initial';
import LoginScreen from '../containers/Login';
import SettingsScreen from '../containers/Settings';
import DrawerScreen from '../containers/Drawer';
import RegisterScreen from '../containers/Register';
import RegisterExtraScreen from '../containers/RegisterExtra';
import colors from '../shared/colors';
import {Platform, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-fa-icons';
import React from 'react';
import Header from '../containers/Header';
import HomeTab from './HomeTab';
import EmptyOverviewScreen from '../components/EmptyOverview';
import Help from '../containers/Help';
import StoreProfile from '../containers/StoreProfile';
import Scanner from '../containers/Scanner';
import RefundCase from '../containers/RefundCase';
import UploadDocumentation from '../containers/UploadDocumentation';
import Contact from '../components/Contact';
import Cities from '../containers/Cities';
import AddCity from '../containers/AddCity';
import StoresScreen from '../containers/Stores';
import OverviewScreen from '../containers/Overview';

const {width, height} = Dimensions.get('screen');
const noHeaderNavigationOptions = {
    headerMode: 'none',
    gesturesEnabled: false,
    headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
    }
};
const hasDrawer = false;

const headerBackNavigationOptions = ({navigation}) => ({
    headerLeft:
        <TouchableOpacity style={styles.defaultHeaderLeftButton}
                          onPress={() => navigation.goBack()}>
            <Icon name='angle-left' style={styles.defaultHeaderLeftIcon}/>
        </TouchableOpacity>,
    headerTitleStyle: {
        fontSize: Platform.OS === 'ios' ? 17 : 18,
        color: colors.whiteColor
    },
    gesturesEnabled: false,
    headerStyle: styles.defaultHeaderStyle,
    headerForceInset: {top: 'always'},
    headerTintColor: colors.activeTabColor
});

const drawerPageNavigationOptions = ({navigation}) => ({
    headerLeft:
        Platform.OS === 'ios' ?
            <TouchableOpacity style={styles.defaultHeaderLeftButton}
                              onPress={() => navigation.goBack()}>
                <Icon name='arrow-left' style={styles.defaultHeaderLeftIcon}/>
            </TouchableOpacity> :
            <TouchableOpacity style={styles.defaultHeaderLeftButton}
                              onPress={() => navigation.navigate('DrawerToggle')}>
                <Icon name='navicon' style={styles.defaultHeaderLeftIcon}/>
            </TouchableOpacity>
    ,
    headerTitleStyle: {
        fontSize: 20,
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    headerStyle: styles.defaultHeaderStyle,
    headerTintColor: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
});


const homeNavigatorOptions = () => ({
    header: (<Header/>),
    ...noHeaderNavigationOptions,
});

const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: createStackNavigator({
            Home: {screen: HomeTab, navigationOptions: homeNavigatorOptions}
        })
    },
    Settings: {
        screen: createStackNavigator({
            Settings: {screen: SettingsScreen, navigationOptions: drawerPageNavigationOptions}
        })
    }
}, {
    contentComponent: DrawerScreen,
    contentOptions: {
        activeBackgroundColor: colors.backgroundColor,
        activeTintColor: colors.activeTabColor,
        inactiveTintColor: colors.activeTabColor
    },
    drawerWidth: Math.min(height, width) * 0.8
});

const MainStackNavigator = createStackNavigator({
    //Home: {screen: HomeTab, navigationOptions: homeNavigatorOptions},
    Cities: {screen: Cities, navigationOptions: homeNavigatorOptions},
    Overview: {screen: OverviewScreen, navigationOptions: homeNavigatorOptions},
    Settings: {screen: SettingsScreen, navigationOptions: headerBackNavigationOptions},
    AddCity: {screen: AddCity, navigationOptions: headerBackNavigationOptions},
    Stores: {screen: StoresScreen, navigationOptions: homeNavigatorOptions},
    Help: {screen: Help, navigationOptions: headerBackNavigationOptions},
    Guide: {screen: EmptyOverviewScreen, navigationOptions: headerBackNavigationOptions},
    Contact: {screen: Contact, navigationOptions: headerBackNavigationOptions},
    StoreProfile: {screen: StoreProfile, navigationOptions: headerBackNavigationOptions},
    RefundCase: {screen: RefundCase, navigationOptions: headerBackNavigationOptions},
    UploadDocumentation: {screen: UploadDocumentation, navigationOptions: headerBackNavigationOptions}
}, {
    lazy: true
});

const routeConfiguration = {
    loginFlow: {
        screen: createStackNavigator({
            Initial: {screen: InitialScreen, navigationOptions: noHeaderNavigationOptions},
            Login: {screen: LoginScreen, navigationOptions: headerBackNavigationOptions},
            Register: {screen: RegisterScreen, navigationOptions: headerBackNavigationOptions},
            RegisterExtra: {screen: RegisterExtraScreen, navigationOptions: headerBackNavigationOptions},
        }, {
            initialRouteName: 'Initial',
            cardStyle: {
                elevation: 0,
                shadowOpacity: 0,
                shadowColor: 'transparent',
            },
        })
    },
    mainFlow: {
        screen: hasDrawer ? MainDrawerNavigator : MainStackNavigator
    },
    merchantFlow: {
        screen: createStackNavigator({
            Scanner: {screen: Scanner, navigationOptions: homeNavigatorOptions}
        }, {initialRouteName: 'Scanner'})
    }
};

const rootNavigatorOptions = {
    initialRouteName: 'loginFlow',
    ...noHeaderNavigationOptions
};

const RootNavigator = createStackNavigator(routeConfiguration, rootNavigatorOptions);

export {
    RootNavigator,
    MainDrawerNavigator,
    hasDrawer
};

const styles = StyleSheet.create({
    defaultHeaderLeftButton: {
        height: 35,
        width: 35,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultHeaderLeftIcon: {
        fontSize: 30,
        height: undefined,
        width: undefined,
        color: colors.activeTabColor
    },
    defaultHeaderStyle: {
        backgroundColor: colors.backgroundColor,
        margin: 0,
        paddingBottom: Platform.OS === 'ios' ? 10 : 0,
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: 'transparent'
    }
});