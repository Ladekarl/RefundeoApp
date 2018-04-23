import types from './ActionTypes';
import LocalStorage from '../storage';
import {strings} from '../shared/i18n';

const Actions = {
    navigateInitial: function () {
        return dispatch => {
            dispatch(this.navigateAndResetToLogin());
            LocalStorage.getUser().then(user => {
                if (user && user.email && user.password && user.uid) {
                    // TODO Sign in with email and password to get token and then navigate to main flow
                    dispatch(this.navigateAndResetToMainFlow());
                } else {
                    dispatch(this.navigateAndResetToLogin());
                }
            });
        };
    },

    navigateAndResetToLogin: function () {
        return {
            type: types.NAVIGATE_LOGGED_OUT
        }
    },

    navigateAndResetToMainFlow: function () {
        return {
            type: types.NAVIGATE_LOGGED_IN
        }
    },

    toggleDrawer: function () {
        return {
            type: types.NAVIGATE_TOGGLE_DRAWER
        }
    },

    navigateSettings: function () {
        return {
            type: types.NAVIGATE_SETTINGS
        }
    },

    login: function (email, password) {
        return dispatch => {
            dispatch({type: types.AUTH_LOGGING_IN});
            // TODO Sign in with email and password then
            const user = {};
            if (!user) {
                dispatch(this.loginError(strings('login.error_user_does_not_exist_in_database')));
            }
            else {
                dispatch(this.loginSuccess(user));
                dispatch(this.navigateAndResetToMainFlow())
                // LocalStorage.setUser(user).then(() => {
                //     dispatch(this.loginSuccess(user));
                //     dispatch(this.navigateAndResetToMainFlow())
                // }).catch(error => {
                //     dispatch(this.loginError(error));
                // });
            }
        };
    },

    logout: function () {
        return {type: types.NAVIGATE_LOGGED_OUT};
    },

    signUp: function () {
        return {type: types.NAVIGATE_SIGN_UP};
    },

    navigateBack: function () {
        return {type: types.NAVIGATE_BACK};
    },

    loginError: function (error) {
        return {
            type: types.AUTH_LOGIN_ERROR,
            error
        }
    },

    loginSuccess: function (user) {
        return {
            type: types.AUTH_LOGIN_SUCCESS,
            user
        }
    },
};

export default Actions;