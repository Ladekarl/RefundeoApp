import {NavigationActions} from 'react-navigation';
import {RootNavigator} from '../navigation/NavigationConfiguration';
import types from '../actions/ActionTypes';

const initialState = {
    currentRoute: 'Initial',
    drawerRoute: '',
    previousRoute: '',
    isMap: true,
    drawerOpen: false,
    modal: {},
    ...RootNavigator.router.getStateForAction(NavigationActions.navigate({routeName: 'loginFlow'}))
};

export default function navigationReducer(state = initialState, action = {}) {
    let nextState = null;
    let previousRoute = state.currentRoute;

    switch (action.type) {
        case NavigationActions.BACK:
        case types.NAVIGATE_BACK: {
            const navigationAction = NavigationActions.back({});
            const backState = RootNavigator.router.getStateForAction(navigationAction, state);
            let currentRoute = getCurrentRoute(backState);
            nextState = {
                ...backState,
                currentRoute: currentRoute,
                drawerRoute: currentRoute
            };
            break;
        }
        case types.NAVIGATE_LOGGED_IN: {
            nextState = {
                ...state,
                ...navigateAndReset('mainFlow', state),
                currentRoute: 'Home',
                drawerRoute: 'Home'
            };
            break;
        }
        case types.NAVIGATE_LOGGED_OUT: {
            nextState = {
                ...state,
                ...navigateAndReset('Initial', state, true),
                currentRoute: 'Initial',
                drawerRoute: ''
            };
            break;
        }
        case types.NAVIGATE_LOG_IN: {
            const navigationAction = NavigationActions.navigate({routeName: 'Login'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'Login',
                drawerRoute: ''
            };
            break;
        }
        case types.NAVIGATE_REGISTER: {
            const navigationAction = NavigationActions.navigate({routeName: 'Register'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'Register',
                drawerRoute: ''
            };
            break;
        }
        case types.NAVIGATE_REGISTER_EXTRA_RESET: {
            nextState = {
                ...state,
                ...navigateAndReset('RegisterExtra', state, true),
                currentRoute: 'RegisterExtra',
                drawerRoute: ''
            };
            break;
        }
        case types.NAVIGATE_REGISTER_EXTRA: {
            const navigationAction = NavigationActions.navigate({routeName: 'RegisterExtra'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'RegisterExtra',
                drawerRoute: ''
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
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                drawerOpen: !state.drawerOpen
            };
            break;
        }
        case types.NAVIGATE_OPEN_DRAWER: {
            const navigationAction = NavigationActions.navigate({routeName: 'DrawerOpen'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                drawerOpen: true
            };
            break;
        }
        case types.NAVIGATE_CLOSE_DRAWER: {
            const navigationAction = NavigationActions.navigate({routeName: 'DrawerClose'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                drawerOpen: false
            };
            break;
        }
        case types.NAVIGATE_SETTINGS: {
            const navigationAction = NavigationActions.navigate({routeName: 'Settings'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'Settings',
                drawerRoute: 'Settings'
            };
            break;
        }
        case types.NAVIGATE_DRAWER_SETTINGS: {
            nextState = {
                ...state,
                ...navigateDrawer('Settings', state),
                currentRoute: 'Settings',
                drawerRoute: 'Settings',
                drawerOpen: false,
            };
            break;
        }
        case types.NAVIGATE_SCANNER: {
            const navigationAction = NavigationActions.navigate({routeName: 'Scanner'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'Scanner',
                drawerRoute: 'Home'
            };
            break;
        }
        case types.NAVIGATE_OVERVIEW: {
            const navigationAction = NavigationActions.navigate({routeName: 'Overview'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'Overview',
                drawerRoute: 'Home'
            };
            break;
        }
        case types.NAVIGATE_DRAWER_HOME: {
            nextState = {
                ...state,
                ...navigateDrawer('Home', state),
                currentRoute: 'Home',
                drawerRoute: 'Home',
                drawerOpen: false,
            };
            break;
        }
        case NavigationActions.NAVIGATE: {
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(action, state),
                drawerOpen: action.routeName === 'DrawerOpen'
            };
            break;
        }
        case NavigationActions.COMPLETE_TRANSITION: {
            const transitionState = RootNavigator.router.getStateForAction(action, state);
            const currentRoute = getCurrentRoute(transitionState);
            nextState = {
                ...state,
                ...transitionState,
                currentRoute: currentRoute,
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
        case types.NAVIGATE_STORE_MAP: {
            let navigatorState = {};
            if(state.currentRoute !== 'Stores') {
                const navigationAction = NavigationActions.navigate({routeName: 'Stores'});
                navigatorState = RootNavigator.router.getStateForAction(navigationAction, state);
            }
            nextState = {
                ...state,
                ...navigatorState,
                currentRoute: 'Stores',
                isMap: true,
                drawerRoute: 'Home'
            };
            break;
        }
        case types.NAVIGATE_STORE_LIST: {
            let navigatorState = {};
            if(state.currentRoute !== 'Stores') {
                const navigationAction = NavigationActions.navigate({routeName: 'Stores'});
                navigatorState = RootNavigator.router.getStateForAction(navigationAction, state);
            }
            nextState = {
                ...state,
                ...navigatorState,
                currentRoute: 'Stores',
                isMap: false,
                drawerRoute: 'Home'
            };
            break;
        }
        case types.NAVIGATE_HELP: {
            const navigationAction = NavigationActions.navigate({routeName: 'Help'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'Help',
                drawerRoute: 'Home'
            };
            break;
        }
        case types.NAVIGATE_STORE_PROFILE: {
            const navigationAction = NavigationActions.navigate({routeName: 'StoreProfile'});
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(navigationAction, state),
                currentRoute: 'StoreProfile',
                drawerRoute: 'Home'
            };
            break;
        }
        default:
            nextState = {
                ...state,
                ...RootNavigator.router.getStateForAction(action, state)
            };
            break;
    }
    nextState = nextState || state;
    nextState.previousRoute = previousRoute;
    return nextState;
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
    let drawerRoute = state.drawerRoute;
    let action;
    if (drawerRoute !== routeName) {
        action = NavigationActions.navigate({
            routeName
        });
        return RootNavigator.router.getStateForAction(action, state);
    }
    action = NavigationActions.navigate({routeName: 'DrawerClose'});
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