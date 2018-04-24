import types from './ActionTypes';
import LocalStorage from '../storage';
import {strings} from '../shared/i18n';
import Api from '../api';

export default {
    navigateInitial,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    navigateSettings,
    navigateDrawerSettings,
    navigateDrawerHome,
    login,
    logout,
    signUp,
    navigateBack,
};

function navigateInitial() {
    return dispatch => {
        LocalStorage.getUser().then(user => {
            if (user && user.token) {
                dispatch(loginSuccess(user));
                dispatch(navigateAndResetToMainFlow());
            } else {
                dispatch(navigateAndResetToLogin());
            }
        }).catch(() => {
            dispatch(navigateAndResetToLogin());
        });
    };
}

function navigateAndResetToLogin() {
    return {
        type: types.NAVIGATE_LOGGED_OUT
    }
}

function navigateLogOut() {
    return {
        type: types.NAVIGATE_LOG_OUT
    }
}

function navigateAndResetToMainFlow() {
    return {
        type: types.NAVIGATE_LOGGED_IN
    }
}

function toggleDrawer() {
    return {
        type: types.NAVIGATE_TOGGLE_DRAWER
    }
}

function openDrawer() {
    return {
        type: types.NAVIGATE_OPEN_DRAWER
    }
}

function closeDrawer() {
    return {
        type: types.NAVIGATE_CLOSE_DRAWER
    }
}

function navigateSettings() {
    return {
        type: types.NAVIGATE_SETTINGS
    }
}

function navigateDrawerSettings() {
    return {
        type: types.NAVIGATE_DRAWER_SETTINGS
    }
}

function navigateDrawerHome() {
    return {
        type: types.NAVIGATE_DRAWER_HOME
    }
}

function login(username, password) {
    if (!username) {
        return loginError(strings('missing_username'));
    }
    if (!password) {
        return loginError(strings('missing_password'));
    }
    return dispatch => {
        dispatch({type: types.AUTH_LOGGING_IN});
        Api.getToken(username, password).then(user => {
            if (!user) {
                dispatch(loginError(strings('login.error_user_does_not_exist_in_database')));
            } else {
                dispatch(loginSuccess(user));
                dispatch(navigateAndResetToMainFlow())
            }
        }).catch((error) => {
            dispatch(loginError(error || ''));
        });
    };
}

function logout() {
    return dispatch => {
        LocalStorage.removeUser().then(() => {
            dispatch(logoutSuccess());
            dispatch(navigateLogOut());
        });
    };
}

function signUp() {
    return {type: types.NAVIGATE_SIGN_UP};
}

function navigateBack() {
    return {type: types.NAVIGATE_BACK};
}

function loginError(error) {
    return {
        type: types.AUTH_LOGIN_ERROR,
        error
    }
}

function loginSuccess(user) {
    return {
        type: types.AUTH_LOGIN_SUCCESS,
        user
    }
}

function logoutSuccess() {
    return {type: types.AUTH_LOGOUT_SUCCESS}
}