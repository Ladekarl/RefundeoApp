import types from './ActionTypes';
import LocalStorage from '../storage';
import {strings} from '../shared/i18n';
import Api from '../api';
import {LoginManager} from 'react-native-fbsdk';
import {Alert} from 'react-native';

export default {
    navigateInitial,
    toggleDrawer,
    openDrawer,
    navigateLogIn,
    navigateRegister,
    closeDrawer,
    navigateSettings,
    navigateDrawerSettings,
    navigateScanner,
    navigateDrawerHome,
    openModal,
    closeModal,
    login,
    loginFacebook,
    logout,
    navigateBack,
    facebookLoginError,
    getRefundCases,
    changeUser,
    getUser,
    changePassword,
};

function navigateInitial() {
    return dispatch => {
        LocalStorage.getUser().then(user => {
            if (user && user.token) {
                dispatch(loginSuccess(user));
                dispatch(navigateAndResetToMainFlow());
                dispatch(getRefundCases());
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

function navigateScanner() {
    return {
        type: types.NAVIGATE_SCANNER
    }
}

function navigateLogIn() {
    return {
        type: types.NAVIGATE_LOG_IN
    }
}

function navigateRegister() {
    return {
        type: types.NAVIGATE_REGISTER
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

function openModal(modalName) {
    return {
        type: types.NAVIGATE_OPEN_MODAL,
        modal: {
            name: modalName,
            open: true
        }
    }
}

function closeModal(modalName) {
    return {
        type: types.NAVIGATE_CLOSE_MODAL,
        modal: {
            name: modalName,
            open: false
        }
    }
}

function loginFacebook(accessToken) {
    return dispatch => {
        dispatch({type: types.AUTH_LOGGING_IN});
        Api.getTokenFacebook(accessToken).then(user => {
            if (user && user.token) {
                dispatch(loginSuccess(user));
                dispatch(navigateAndResetToMainFlow());
                dispatch(getRefundCases());
            } else {
                dispatch(facebookLoginError(strings('login.error_user_does_not_exist_in_database')));
            }
        }).catch(() => {
            dispatch(facebookLoginError(strings('login.unknown_error')));
        });
    };
}

function login(username, password) {
    if (!username) {
        return loginError(strings('login.missing_username'));
    }
    if (!password) {
        return loginError(strings('login.missing_password'));
    }
    return dispatch => {
        dispatch({type: types.AUTH_LOGGING_IN});
        Api.getToken(username, password).then(user => {
            if (user && user.token) {
                dispatch(loginSuccess(user));
                dispatch(navigateAndResetToMainFlow());
                dispatch(getRefundCases());
            } else {
                dispatch(loginError(strings('login.error_user_does_not_exist_in_database')));
            }
        }).catch(() => {
            dispatch(loginError(strings('login.unknown_error')));
        });
    };
}

function getRefundCases() {
    return dispatch => {
        dispatch(gettingRefundCases());
        Api.getRefundCases().then((refundCases) => {
            dispatch(getRefundCasesSuccess(refundCases));
        }).catch(() => {
            dispatch(getRefundCasesError('Some error text'));
        });
    }
}

function gettingRefundCases() {
    return {
        type: types.REFUND_GETTING_REFUND_CASES
    }
}

function getRefundCasesSuccess(refundCases = []) {
    return {
        type: types.REFUND_GET_REFUND_CASES_SUCCESS,
        refundCases
    }
}

function getRefundCasesError(error = '') {
    return {
        type: types.REFUND_GET_REFUND_CASES_ERROR,
        getRefundCasesError: error
    }
}

function logout() {
    return dispatch => {
        LoginManager.logOut();
        LocalStorage.removeUser().then(() => {
            dispatch(logoutSuccess());
            dispatch(navigateLogOut());
        });
    };
}

function navigateBack() {
    return {type: types.NAVIGATE_BACK};
}

function loginError(error = '') {
    return {
        type: types.AUTH_LOGIN_ERROR,
        loginError: error.toString()
    }
}

function facebookLoginError(error = '') {
    return {
        type: types.AUTH_FACEBOOK_LOGIN_ERROR,
        facebookLoginError: error.toString()
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

function changeUser(newUser) {
    return dispatch => {
        dispatch(changingUser());
        Api.updateUser(newUser).then((user) => {
            dispatch(changeUserSuccess(user));
        }).catch(() => {
            Alert.alert(strings('settings.error_title'), strings('settings.change_user_error'));
            dispatch(changeUserError(strings('settings.change_user_error')));
        });
    }
}

function changingUser() {
    return {
        type: types.AUTH_CHANGING_USER
    }
}

function changeUserSuccess(user) {
    return {
        type: types.AUTH_CHANGE_USER_SUCCESS,
        user
    }
}

function changeUserError(error) {
    return {
        type: types.AUTH_CHANGE_USER_ERROR,
        error
    }
}

function getUser() {
    return dispatch => {
        dispatch(gettingUser());
        Api.getUser().then((user) => {
            dispatch(getUserSuccess(user));
        }).catch(() => {
            dispatch(getUserError('Could not get user'));
        });
    }
}

function gettingUser() {
    return {
        type: types.AUTH_GETTING_USER
    }
}

function getUserSuccess(user) {
    return {
        type: types.AUTH_GET_USER_SUCCESS,
        user
    }
}

function getUserError(error) {
    return {
        type: types.AUTH_GET_USER_ERROR,
        error
    }
}

function changePassword(oldPassword, newPassword, confPassword) {
    return dispatch => {
        dispatch(changingPassword());
        Api.changePassword(oldPassword, newPassword, confPassword).then(() => {
            dispatch(changePasswordSuccess());
        }).catch(() => {
            Alert.alert(strings('settings.error_title'), strings('settings.change_password_error'));
            dispatch(changePasswordError(strings('settings.change_password_error')));
        });
    }
}

function changingPassword() {
    return {
        type: types.AUTH_CHANGING_PASSWORD
    }
}

function changePasswordSuccess() {
    return {
        type: types.AUTH_CHANGE_PASSWORD_SUCCESS
    }
}

function changePasswordError(error = '') {
    return {
        type: types.AUTH_CHANGE_PASSWORD_ERROR,
        error
    }
}



