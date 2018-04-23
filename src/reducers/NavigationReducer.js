import {NavigationActions} from 'react-navigation';
import {RootNavigator} from '../navigation/NavigationConfiguration';
import types from '../actions/ActionTypes';

export default function navigationReducer(state, action) {
    let nextState = null;
    switch (action.type) {
        case types.NAVIGATE_BACK: {
            const navigationAction = NavigationActions.back({});
            nextState = RootNavigator.router.getStateForAction(navigationAction, state);
            break;
        }
        case types.NAVIGATE_LOGGED_IN: {
            nextState = navigateAndReset('mainFlow', state);
            break;
        }
        case types.NAVIGATE_LOGGED_OUT: {
            nextState = navigateAndReset('Login', state, true);
            break;
        }
        case types.NAVIGATE_TOGGLE_DRAWER: {
            const navAction = NavigationActions.navigate({routeName: 'DrawerToggle'});
            nextState = RootNavigator.router.getStateForAction(navAction, state);
            break;
        }
        case types.NAVIGATE_SETTINGS: {
            const navAction = NavigationActions.navigate({routeName: 'Settings'});
            nextState = RootNavigator.router.getStateForAction(navAction, state);
            break;
        }
        default:
            nextState = RootNavigator.router.getStateForAction(action, state);
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