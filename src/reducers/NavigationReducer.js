import {NavigationActions} from 'react-navigation';
import {RootNavigator} from '../navigation/NavigationConfiguration';
import types from '../actions/ActionTypes';

const initialState = {
    currentRoute: 'SplashScreen',
    drawerOpen: false,
    modal: {},
    ...RootNavigator.router.getStateForAction(NavigationActions.navigate({routeName: 'loginFlow'}))
};

export default function navigationReducer(state = initialState, action = {}) {
    let nextState = null;
    switch (action.type) {
        case NavigationActions.BACK:
        case types.NAVIGATE_BACK: {
            const navigationAction = NavigationActions.back({});
            const backState = RootNavigator.router.getStateForAction(navigationAction, state);
            nextState = {
                ...backState,
                currentRoute: getCurrentRoute(backState)
            };
            break;
        }
        case types.NAVIGATE_LOGGED_IN: {
            nextState = {
                ...navigateAndReset('mainFlow', state),
                currentRoute: 'Home'
            };
            break;
        }
        case types.NAVIGATE_LOGGED_OUT: {
            nextState = {
                ...navigateAndReset('SplashScreen', state, true),
                currentRoute: 'SplashScreen'
            };
            break;
        }
        case types.NAVIGATE_LOG_IN: {
            const navigationAction = NavigationActions.navigate({routeName: 'Login'});
            nextState = {
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'Login'
            };
            break;
        }
        case types.NAVIGATE_LOG_OUT: {
            nextState = initialState;
            break;
        }
        case types.NAVIGATE_TOGGLE_DRAWER: {
            const routeName = state.drawerOpen ? 'DrawerClose' : 'DrawerOpen';
            const navigationAction = NavigationActions.navigate({routeName});
            nextState = {
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                drawerOpen: !state.drawerOpen
            };
            break;
        }
        case types.NAVIGATE_OPEN_DRAWER: {
            const navigationAction = NavigationActions.navigate({routeName: 'DrawerOpen'});
            nextState = {
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                drawerOpen: true
            };
            break;
        }
        case types.NAVIGATE_CLOSE_DRAWER: {
            const navigationAction = NavigationActions.navigate({routeName: 'DrawerClose'});
            nextState = {
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                drawerOpen: false
            };
            break;
        }
        case types.NAVIGATE_SETTINGS: {
            const navigationAction = NavigationActions.navigate({routeName: 'Settings'});
            nextState = {
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'Settings'
            };
            break;
        }
        case types.NAVIGATE_DRAWER_SETTINGS: {
            nextState = {
                ...navigateDrawer('Settings', state),
                currentRoute: 'Settings',
                drawerOpen: false,
            };
            break;
        }
        case types.NAVIGATE_DRAWER_HOME: {
            nextState = {
                ...navigateDrawer('Home', state),
                currentRoute: 'Home',
                drawerOpen: false,
            };
            break;
        }
        case NavigationActions.NAVIGATE: {
            nextState = {
                ...RootNavigator.router.getStateForAction(action, state),
                drawerOpen: action.routeName === 'DrawerOpen'
            };
            break;
        }
        case types.NAVIGATE_CLOSE_MODAL: {
            const modal = Object.assign({}, state.modal);
            modal[action.modal.name] = action.modal.open;
            nextState = {
                ...state,
                modal
            };
            break;
        }
        case types.NAVIGATE_OPEN_MODAL: {
            const modal = Object.assign({}, state.modal);
            modal[action.modal.name] = action.modal.open;
            nextState = {
                ...state,
                modal
            };
            break;
        }
        default:
            nextState = {
                ...RootNavigator.router.getStateForAction(action, state)
            };
            break;
    }
    return nextState || state;
}

const navigateAndReset = (routeName, state, isNested) => {
    const action = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: routeName})],
    });
    if (!isNested) {
        action.key = null
    }
    return RootNavigator.router.getStateForAction(action, state);
};

const navigateDrawer = (routeName, state) => {
    let currentRoute = state.currentRoute;
    let action;
    if (currentRoute !== routeName) {
        action = NavigationActions.navigate({
            routeName
        });
        return RootNavigator.router.getStateForAction(action, state);
    } else {
        action = NavigationActions.navigate({routeName: 'DrawerClose'});
    }
    return RootNavigator.router.getStateForAction(action, state);
};

const getCurrentRoute = (state) => {
    const findCurrentRoute = (navState) => {
        if (navState.index !== undefined) {
            return findCurrentRoute(navState.routes[navState.index])
        }
        return navState.routeName
    };
    return findCurrentRoute(state)
};