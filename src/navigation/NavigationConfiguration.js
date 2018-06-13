import {DrawerNavigator, StackNavigator} from 'react-navigation';
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

const {width, height} = Dimensions.get('screen');
const noHeaderNavigationOptions = {headerMode: 'none'};
const hasDrawer = false;

const headerBackNavigationOptions = ({navigation}) => ({
    headerLeft:
        <TouchableOpacity style={styles.defaultHeaderLeftButton}
                          onPress={() => navigation.goBack()}>
            <Icon name={Platform.OS === 'ios' ? 'angle-left' : 'arrow-left'} style={styles.defaultHeaderLeftIcon}/>
        </TouchableOpacity>,
    headerTitleStyle: {
        fontSize: 18,
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    headerStyle: styles.defaultHeaderStyle,
    headerTintColor: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
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

const MainDrawerNavigator = DrawerNavigator({
    Home: {
        screen: StackNavigator({
            Home: {screen: HomeTab, navigationOptions: homeNavigatorOptions}
        })
    },
    Settings: {
        screen: StackNavigator({
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

const MainStackNavigator = StackNavigator({
    Home: {screen: HomeTab, navigationOptions: homeNavigatorOptions},
    Settings: {screen: SettingsScreen, navigationOptions: headerBackNavigationOptions},
    Help: {screen: EmptyOverviewScreen, navigationOptions: headerBackNavigationOptions}
});

const routeConfiguration = {
    loginFlow: {
        screen: StackNavigator({
            Initial: {screen: InitialScreen, navigationOptions: noHeaderNavigationOptions},
            Login: {screen: LoginScreen, navigationOptions: headerBackNavigationOptions},
            Register: {screen: RegisterScreen, navigationOptions: headerBackNavigationOptions},
            RegisterExtra: {screen: RegisterExtraScreen, navigationOptions: headerBackNavigationOptions},
        }, {initialRouteName: 'Initial'})
    },
    mainFlow: {
        screen: hasDrawer ? MainDrawerNavigator : MainStackNavigator
    }
};

const rootNavigatorOptions = {
    initialRouteName: 'loginFlow',
    ...noHeaderNavigationOptions
};

const RootNavigator = StackNavigator(routeConfiguration, rootNavigatorOptions);

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
        fontSize: Platform.OS === 'ios' ? 25 : 20,
        height: undefined,
        width: undefined,
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    defaultHeaderStyle: {
        elevation: 1,
        backgroundColor: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor,
        margin: 0,
        paddingBottom: Platform.OS === 'ios' ? 10 : 0
    }
});