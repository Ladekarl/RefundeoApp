import types from './ActionTypes';
import LocalStorage from '../storage';
import {strings} from '../shared/i18n';
import Api from '../api';
import {LoginManager} from 'react-native-fbsdk';
import {Alert} from 'react-native';
import NotificationService from '../shared/NotificationService';

export default {
    navigateInitial,
    navigateAndResetToMainFlow,
    toggleDrawer,
    openDrawer,
    claimRefundCase,
    uploadDocumentation,
    navigateLogIn,
    navigateRegister,
    closeDrawer,
    navigateSettings,
    navigateDrawerSettings,
    navigateScanner,
    navgiateOverview,
    navigateDrawerHome,
    openModal,
    closeModal,
    login,
    loginFacebook,
    register,
    logout,
    navigateBack,
    facebookLoginError,
    getRefundCases,
    changeUser,
    getUser,
    changePassword,
    requestRefund
};

function navigateInitial() {
    return dispatch => {
        LocalStorage.getUser().then(user => {
            if (user && user.token) {
                NotificationService.register();
                dispatch(loginSuccess(user));
                if (missingUserInfo(user)) {
                    dispatch(navigateRegisterExtraReset());
                } else {
                    dispatch(navigateAndResetToMainFlow());
                    dispatch(getRefundCases());
                }
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
    };
}

function navigateLogOut() {
    return {
        type: types.NAVIGATE_LOG_OUT
    };
}

function navigateScanner() {
    return {
        type: types.NAVIGATE_SCANNER
    };
}

function navgiateOverview() {
    return {
        type: types.NAVIGATE_OVERVIEW
    }
}

function navigateLogIn() {
    return {
        type: types.NAVIGATE_LOG_IN
    };
}

function navigateRegister() {
    return {
        type: types.NAVIGATE_REGISTER
    };
}

function navigateRegisterExtra() {
    return {
        type: types.NAVIGATE_REGISTER_EXTRA
    };
}

function navigateRegisterExtraReset() {
    return {
        type: types.NAVIGATE_REGISTER_EXTRA_RESET
    };
}

function navigateAndResetToMainFlow() {
    return {
        type: types.NAVIGATE_LOGGED_IN
    };
}

function toggleDrawer() {
    return {
        type: types.NAVIGATE_TOGGLE_DRAWER
    };
}

function openDrawer() {
    return {
        type: types.NAVIGATE_OPEN_DRAWER
    };
}

function closeDrawer() {
    return {
        type: types.NAVIGATE_CLOSE_DRAWER
    };
}

function navigateSettings() {
    return {
        type: types.NAVIGATE_SETTINGS
    };
}

function navigateDrawerSettings() {
    return {
        type: types.NAVIGATE_DRAWER_SETTINGS
    };
}

function navigateDrawerHome() {
    return {
        type: types.NAVIGATE_DRAWER_HOME
    };
}

function openModal(modalName) {
    return {
        type: types.NAVIGATE_OPEN_MODAL,
        modal: {
            name: modalName,
            open: true
        }
    };
}

function closeModal(modalName) {
    return {
        type: types.NAVIGATE_CLOSE_MODAL,
        modal: {
            name: modalName,
            open: false
        }
    };
}

function loginFacebook(accessToken) {
    return dispatch => {
        dispatch({type: types.AUTH_LOGGING_IN});
        Api.getTokenFacebook(accessToken).then(user => {
            if (user && user.token) {
                dispatch(loginSuccess(user));
                NotificationService.register();
                if (missingUserInfo(user)) {
                    dispatch(navigateRegisterExtra());
                } else {
                    dispatch(navigateAndResetToMainFlow());
                    dispatch(getRefundCases());
                }
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
                NotificationService.register();
                dispatch(loginSuccess(user));
                if (missingUserInfo(user)) {
                    dispatch(navigateRegisterExtra());
                } else {
                    dispatch(navigateAndResetToMainFlow());
                    dispatch(getRefundCases());
                }
            } else {
                dispatch(loginError(strings('login.error_user_does_not_exist_in_database')));
            }
        }).catch(() => {
            dispatch(loginError(strings('login.unknown_error')));
        });
    };
}

function register(username, password, confPassword, acceptedTermsOfService, termsOfService, acceptedPrivacyPolicy, privacyPolicy) {
    if (!username) {
        return registerError(strings('login.missing_username'));
    }
    const passError = checkPassword(password, confPassword);
    if (passError) {
        return registerError(passError);
    }
    if (!checkEmail(username)) {
        return registerError(username + strings('register.not_email'));
    }
    if (!acceptedTermsOfService) {
        return registerError(strings('register.accept_terms_of_service'));
    }
    if (!acceptedPrivacyPolicy) {
        return registerError(strings('register.accept_privacy_policy'));
    }
    return dispatch => {
        dispatch({type: types.AUTH_REGISTERING});
        Api.register(username, password, acceptedTermsOfService, termsOfService, acceptedPrivacyPolicy, privacyPolicy).then(user => {
            if (user && user.token) {
                NotificationService.register();
                dispatch(registerSuccess(user));
                if (missingUserInfo(user)) {
                    dispatch(navigateRegisterExtra());
                } else {
                    dispatch(navigateAndResetToMainFlow());
                    dispatch(getRefundCases());
                }
            } else {
                dispatch(registerError(strings('register.unknown_error')));
            }
        }).catch((error) => {
            dispatch(registerError(error));
        });
    };
}

function uploadDocumentation(refundCase, documentation) {
    return dispatch => {
        dispatch(uploadingDocumentation());
        Api.uploadDocumentation(refundCase, documentation).then(() => {
            dispatch(getRefundCases());
            dispatch(uploadDocumentationSuccess());
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(uploadDocumentationError(strings('refund_case.upload_documentation_error')));
            }
        });
    };
}

function requestRefund(refundCase) {
    return dispatch => {
        dispatch(requestingRefund());
        Api.requestRefund(refundCase).then(() => {
            dispatch(getRefundCases());
            dispatch(requestingRefundSuccess());
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(requestingRefundError(strings('refund_case.request_refund_error')));
            }
        });
    };
}

function claimRefundCase(refundCaseId) {
    return dispatch => {
      dispatch(claimingRefundCase());
      Api.claimRefundCase(refundCaseId).then(() => {
          dispatch(getRefundCases());
          dispatch(navgiateOverview());
          dispatch(claimRefundCaseSuccess());
      }).catch((response) => {
         if(shouldLogout(response)) {
             dispatch(logout());
         } else if(response.status === 400) {
             dispatch(claimRefundCaseError(strings('refund_case.refund_case_already_claimed')));
         }
         else {
             dispatch(claimRefundCaseError(strings('refund_case.claim_refund_case_error')));
         }
      });
    };
}

function claimingRefundCase() {
    return {
        type: types.REFUND_CLAIMING_REFUND_CASE
    }
}

function claimRefundCaseSuccess() {
    return {
        type: types.REFUND_CLAIM_REFUND_CASE_SUCCESS
    }
}

function claimRefundCaseError(claimRefundCaseError = '') {
    return {
        type: types.REFUND_CLAIM_REFUND_CASE_ERROR,
        claimRefundCaseError
    }
}

function requestingRefund() {
    return {
        type: types.REFUND_REQUESTING_REFUND
    };
}

function requestingRefundSuccess() {
    return {
        type: types.REFUND_REQUEST_REFUND_SUCCESS
    };
}

function requestingRefundError(requestRefundError = '') {
    return {
        type: types.REFUND_REQUEST_REFUND_ERROR,
        requestRefundError
    };
}

function uploadingDocumentation() {
    return {
        type: types.REFUND_UPLOADING_DOCUMENTATION
    };
}

function uploadDocumentationSuccess() {
    return {
        type: types.REFUND_UPLOAD_DOCUMENTATION_SUCCESS
    };
}

function uploadDocumentationError(error = '') {
    return {
        type: types.REFUND_UPLOAD_DOCUMENTATION_ERROR,
        documentationError: error
    };
}

function getRefundCases() {
    return dispatch => {
        dispatch(gettingRefundCases());
        Api.getRefundCases().then((refundCases) => {
            dispatch(getRefundCasesSuccess(refundCases));
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(getRefundCasesError('Some error text'));
            }
        });
    };
}

function gettingRefundCases() {
    return {
        type: types.REFUND_GETTING_REFUND_CASES
    };
}

function getRefundCasesSuccess(refundCases = []) {
    return {
        type: types.REFUND_GET_REFUND_CASES_SUCCESS,
        refundCases
    };
}

function getRefundCasesError(error = '') {
    return {
        type: types.REFUND_GET_REFUND_CASES_ERROR,
        getRefundCasesError: error
    };
}

function logout() {
    return dispatch => {
        LoginManager.logOut();
        LocalStorage.removeUser().then(() => {
            dispatch(logoutSuccess());
            dispatch(navigateLogOut());
            NotificationService.unregister();
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
    };
}

function registerError(error = '') {
    return {
        type: types.AUTH_REGISTER_ERROR,
        registerError: error
    };
}

function facebookLoginError(error = '') {
    return {
        type: types.AUTH_FACEBOOK_LOGIN_ERROR,
        facebookLoginError: error.toString()
    };
}

function loginSuccess(user) {
    return {
        type: types.AUTH_LOGIN_SUCCESS,
        user
    };
}

function registerSuccess(user) {
    return {
        type: types.AUTH_REGISTER_SUCCESS,
        user
    };
}

function logoutSuccess() {
    return {type: types.AUTH_LOGOUT_SUCCESS};
}

function changeUser(newUser) {
    return dispatch => {
        dispatch(changingUser());
        Api.updateUser(newUser).then((user) => {
            dispatch(changeUserSuccess(user));
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                Alert.alert(strings('settings.error_title'), strings('settings.change_user_error'));
                dispatch(changeUserError(strings('settings.change_user_error')));
            }
        });
    };
}

function changingUser() {
    return {
        type: types.AUTH_CHANGING_USER
    };
}

function changeUserSuccess(user) {
    return {
        type: types.AUTH_CHANGE_USER_SUCCESS,
        user
    };
}

function changeUserError(error) {
    return {
        type: types.AUTH_CHANGE_USER_ERROR,
        error
    };
}

function getUser() {
    return dispatch => {
        dispatch(gettingUser());
        Api.getUser().then((user) => {
            dispatch(getUserSuccess(user));
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(getUserError('Could not get user'));
            }
        });
    };
}

function gettingUser() {
    return {
        type: types.AUTH_GETTING_USER
    };
}

function getUserSuccess(user) {
    return {
        type: types.AUTH_GET_USER_SUCCESS,
        user
    };
}

function getUserError(error) {
    return {
        type: types.AUTH_GET_USER_ERROR,
        error
    };
}

function changePassword(oldPassword, newPassword, confPassword) {
    const passError = checkPassword(newPassword, confPassword);
    if (passError) {
        return changePasswordError(passError);
    }
    return dispatch => {
        dispatch(changingPassword());
        Api.changePassword(oldPassword, newPassword, confPassword).then(() => {
            dispatch(changePasswordSuccess());
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                Alert.alert(strings('settings.error_title'), strings('settings.change_password_error'));
                dispatch(changePasswordError(strings('settings.change_password_error')));
            }
        });
    };
}

function changingPassword() {
    return {
        type: types.AUTH_CHANGING_PASSWORD
    };
}

function changePasswordSuccess() {
    return {
        type: types.AUTH_CHANGE_PASSWORD_SUCCESS
    };
}

function changePasswordError(error = '') {
    return {
        type: types.AUTH_CHANGE_PASSWORD_ERROR,
        error
    };
}

function missingUserInfo(user) {
    return !user.firstName || !user.lastName || !user.country || !user.bankAccountNumber || !user.bankRegNumber || !user.acceptedPrivacyPolicy || !user.acceptedTermsOfService;
}

function checkPassword(newPassword, confPassword) {
    if (newPassword && confPassword && newPassword === confPassword) {
        // noinspection EqualityComparisonWithCoercionJS
        const hasLowerCase = newPassword.toUpperCase() != newPassword;
        const uniqueChars = String.prototype.concat(...new Set(newPassword)).length;
        if (hasLowerCase && newPassword.length >= 8 && uniqueChars >= 4) {
            return null;
        }
        else if (newPassword.length < 8) {
            return strings('settings.error_password_too_short');
        }
        else if (uniqueChars < 4) {
            return strings('settings.error_password_not_unique');
        }
        else if (!hasLowerCase) {
            return strings('settings.error_password_only_uppercase');
        }
    } else if (!newPassword || !confPassword) {
        return strings('settings.error_password_not_filled');
    } else {
        return strings('settings.error_password_not_same');
    }
}

function checkEmail(email) {
    return /^(([^<>()\[\].,;:\s@"]+(.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})/.test(email);
}

function shouldLogout(response) {
    return response.status === 401 || response.status === 404 || response.status === 403;
}




