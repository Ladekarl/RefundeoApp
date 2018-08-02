import types from './ActionTypes';
import LocalStorage from '../storage';
import {formatDate, strings} from '../shared/i18n';
import Api from '../api';
import {LoginManager} from 'react-native-fbsdk';
import {Alert} from 'react-native';
import NotificationService from '../shared/NotificationService';
import Validation from '../shared/Validation';
import Helpers from '../api/Helpers';

export default {
    navigateInitial,
    navigateAndResetToMainFlow,
    toggleDrawer,
    openDrawer,
    createRefundCase,
    uploadDocumentation,
    navigateLogIn,
    navigateRegister,
    closeDrawer,
    navigateSettings,
    navigateDrawerSettings,
    navigateScanner,
    navigateQrCode,
    navgiateOverview,
    navigateHelp,
    navigateStoreProfile,
    navigateRefundCase,
    navigateDrawerHome,
    navigateStoreList,
    navigateStoreMap,
    navigateRegisterExtra,
    navigateGuide,
    navigateContact,
    openModal,
    closeModal,
    login,
    loginFacebook,
    register,
    logout,
    navigateBack,
    facebookLoginError,
    getRefundCases,
    getSelectedRefundCase,
    changeUser,
    getUser,
    getScannedUser,
    changePassword,
    requestRefund,
    getMerchants,
    selectMerchant,
    selectRefundCase,
    navigateUploadDocumentation,
    selectUploadDocumentation,
    uploadTempVatFormImage,
    uploadTempReceiptImage,
    sendVatFormEmail,
    changeFilterValues,
    forgotPassword
};

function forgotPassword(username) {
    if (!username) {
        return forgotPasswordError(strings('login.missing_username'));
    }
    return dispatch => {
        dispatch(postingForgotPassword());
        Api.postRequestResetPassword(username).then((response) => {
            dispatch(forgotPasswordSuccess(response.email));
        }).catch(error => {
            dispatch(forgotPasswordError(strings('login.unknown_error')));
        });
    };
}

function forgotPasswordSuccess(email) {
    return {
        type: types.AUTH_FORGOT_PASSWORD_SUCCESS,
        forgotPasswordEmail: email
    }
}


function forgotPasswordError(error = '') {
    return {
        type: types.AUTH_FORGOT_PASSWORD_ERROR,
        error
    }
}

function postingForgotPassword() {
    return {
        type: types.AUTH_POSTING_FORGOT_PASSWORD
    }
}

function navigateGuide() {
    return {
        type: types.NAVIGATE_GUIDE
    };
}

function navigateContact() {
    return {
        type: types.NAVIGATE_CONTACT
    };
}

function sendVatFormEmail(refundCase, email) {
    return dispatch => {
        dispatch(sendingEmail());
        Api.postEmail(refundCase, email).then(() => {
            dispatch(sendEmailSuccess());
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(sendEmailError());
            }
        });
    };
}

function sendingEmail() {
    return {
        type: types.REFUND_SENDING_EMAIL
    };
}

function sendEmailSuccess() {
    return {
        type: types.REFUND_SEND_EMAIL_SUCCESS
    };
}

function sendEmailError(error = '') {
    return {
        type: types.REFUND_SEND_EMAIL_ERROR,
        error
    };
}

function uploadTempVatFormImage(refundCaseId, tempVatFormImage, goBack) {
    return dispatch => {
        LocalStorage.saveVatFormImage(refundCaseId, tempVatFormImage);
        dispatch({
            type: types.REFUND_UPLOAD_TEMP_VAT_FORM_IMAGE,
            tempVatFormImage
        });
        if (goBack) {
            dispatch(navigateBack());
        }
    };
}

function uploadTempReceiptImage(refundCaseId, tempReceiptImage, goBack) {
    return dispatch => {
        LocalStorage.saveReceiptImage(refundCaseId, tempReceiptImage);
        dispatch({
            type: types.REFUND_UPLOAD_TEMP_RECEIPT_IMAGE,
            tempReceiptImage
        });
        if (goBack) {
            dispatch(navigateBack());
        }
    };
}

function selectUploadDocumentation(documentation) {
    return dispatch => {
        dispatch({
            type: types.REFUND_SELECT_UPLOAD_DOCUMENTATION,
            documentation
        });
        dispatch(navigateUploadDocumentation());
    };
}

function navigateUploadDocumentation() {
    return {
        type: types.NAVIGATE_UPLOAD_DOCUMENTATION
    };
}

function changeFilterValues(distanceSliderValue, refundSliderValue, onlyOpenValue, tagValue) {
    return {
        type: types.MERCHANT_CHANGE_FILTER_VALUE,
        distanceSliderValue,
        refundSliderValue,
        onlyOpenValue,
        tagValue
    };
}

function getMerchants() {
    return dispatch => {
        dispatch(gettingMerchants());
        Api.getAllMerchants().then(merchants => {
            dispatch(getMerchantsSuccess(merchants));
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(getMerchantsError());
            }
        });
    };
}

function gettingMerchants() {
    return {
        type: types.MERCHANT_GETTING_MERCHANTS
    };
}

function getMerchantsError(error = '') {
    return {
        type: types.MERCHANT_GET_MERCHANTS_ERROR,
        error
    };
}

function getMerchantsSuccess(merchants) {
    return {
        merchants,
        type: types.MERCHANT_GET_MERCHANTS_SUCCESS
    };
}

function selectMerchant(merchant) {
    return dispatch => {
        dispatch({
            type: types.MERCHANT_SELECT_MERCHANT,
            merchant
        });
        dispatch(navigateStoreProfile(merchant.companyName));
    };
}

function selectRefundCase(refundCase) {
    return dispatch => {
        dispatch({
            type: types.REFUND_SELECT_REFUND_CASE,
            refundCase
        });
        dispatch(navigateRefundCase(formatDate(refundCase.dateCreated)));
    };
}

function navigateInitial() {
    return dispatch => {
        LocalStorage.getUser().then(user => {
            if (user && user.token) {
                dispatch(loginSuccess(user));
                if (user.isMerchant) {
                    dispatch(navigateScanner());
                }
                else if (Validation.missingUserInfo(user)) {
                    dispatch(getInitialData());
                    NotificationService.register();
                    dispatch(navigateRegisterExtraReset());
                } else {
                    NotificationService.register();
                    dispatch(getInitialDataThenNavigate());
                }
            } else {
                dispatch(navigateAndResetToLogin());
            }
        }).catch(() => {
            dispatch(navigateAndResetToLogin());
        });
    };
}

function getInitialData() {
    return dispatch => {
        Promise.all([
            Api.getRefundCases(),
            Api.getAllMerchants(),
            Api.getTags()
        ]).then(([refundCases, merchants, tags]) => {
            dispatch(getRefundCasesSuccess(refundCases));
            dispatch(getMerchantsSuccess(merchants));
            dispatch(getTagsSuccess(tags));
        });
    };
}

function getInitialDataThenNavigate() {
    return dispatch => {
        Promise.all([
                Api.getRefundCases().catch((response) => {
                    if (shouldLogout(response)) {
                        dispatch(logout());
                    } else {
                        Helpers.handleRefundCasesResponse().then(refundCases => {
                            if (refundCases) {
                                dispatch(getRefundCasesError(refundCases));
                            } else {
                                dispatch(getRefundCasesError());
                            }
                            dispatch(navigateAndResetToMainFlow());
                        });
                    }
                }),
                Api.getAllMerchants().catch((response) => {
                    if (shouldLogout(response)) {
                        dispatch(logout());
                    } else {
                        Helpers.handleMerchantsResponse().then(merchants => {
                            if (merchants) {
                                dispatch(getMerchantsSuccess(merchants));
                            } else {
                                dispatch(getMerchantsError());
                            }
                            dispatch(navigateAndResetToMainFlow());
                        });
                    }
                }),
                Api.getTags().catch(response => {
                    if (shouldLogout(response)) {
                        dispatch(logout());
                    } else {
                        Helpers.handleTagsResponse().then(tags => {
                            if (tags) {
                                dispatch(getTagsSuccess(tags));
                            }
                            dispatch(navigateAndResetToMainFlow());
                        });
                    }
                })
            ]
        ).then(([refundCases, merchants, tags]) => {
            dispatch(getRefundCasesSuccess(refundCases));
            dispatch(getMerchantsSuccess(merchants));
            dispatch(getTagsSuccess(tags));
            dispatch(navigateAndResetToMainFlow());
        });
    };
}

function getTagsSuccess(tags) {
    return {
        type: types.MERCHANT_GET_TAGS_SUCCESS,
        tags
    };
}

function navigateStoreProfile(companyName) {
    return {
        type: types.NAVIGATE_STORE_PROFILE,
        companyName
    };
}

function navigateRefundCase(dateCreated) {
    return {
        type: types.NAVIGATE_REFUND_CASE,
        dateCreated
    };
}

function navigateHelp() {
    return {
        type: types.NAVIGATE_HELP
    };
}

function navigateStoreMap() {
    return {
        type: types.NAVIGATE_STORE_MAP
    };
}

function navigateStoreList() {
    return {
        type: types.NAVIGATE_STORE_LIST
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

function navigateQrCode() {
    return {
        type: types.NAVIGATE_QR_CODE
    };
}

function navgiateOverview() {
    return {
        type: types.NAVIGATE_OVERVIEW
    };
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
                if (user.isMerchant) {
                    dispatch(navigateScanner());
                }
                else if (Validation.missingUserInfo(user)) {
                    dispatch(getInitialData());
                    NotificationService.register();
                    dispatch(navigateRegisterExtra());
                } else {
                    dispatch(getInitialDataThenNavigate());
                    NotificationService.register();
                }
                dispatch(loginSuccess(user));
            } else {
                dispatch(facebookLoginError(strings('login.error_user_does_not_exist_in_database')));
            }
        }).catch((error) => {
            dispatch(facebookLoginError(error));
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
                if (user.isMerchant) {
                    dispatch({type: types.AUTH_STOP_FETCHING});
                    dispatch(navigateScanner());
                }
                else if (Validation.missingUserInfo(user)) {
                    dispatch(getInitialData());
                    NotificationService.register();
                    dispatch(navigateRegisterExtra());
                } else {
                    dispatch(getInitialDataThenNavigate());
                    NotificationService.register();
                }
                dispatch(loginSuccess(user));
            } else {
                dispatch(loginError(strings('login.error_user_does_not_exist_in_database')));
            }
        }).catch((error) => {
            dispatch(loginError(error));
        });
    };
}

function register(username, password, email, confPassword, acceptedTermsOfService, termsOfService, acceptedPrivacyPolicy, privacyPolicy) {
    if (!username) {
        return registerError(strings('login.missing_username'));
    }
    const passError = Validation.checkPassword(password, confPassword);
    if (passError) {
        return registerError(passError);
    }
    if (!Validation.validateEmail(username)) {
        return registerError(username + strings('register.not_email'));
    }
    if (!Validation.validateEmail(email)) {
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
        Api.register(username, password, email, acceptedTermsOfService, termsOfService, acceptedPrivacyPolicy, privacyPolicy).then(user => {
            if (user && user.token) {
                if (user.isMerchant) {
                    dispatch({type: types.AUTH_STOP_FETCHING});
                    dispatch(navigateScanner());
                }
                else if (Validation.missingUserInfo(user)) {
                    dispatch(navigateRegisterExtra());
                    dispatch(getInitialData());
                }
                else {
                    dispatch(getInitialDataThenNavigate());
                    NotificationService.register();
                }
                dispatch(registerSuccess(user));
            } else {
                dispatch(registerError(strings('register.unknown_error')));
            }
        }).catch((error) => {
            dispatch(registerError(error));
        });
    };
}

function uploadDocumentation(refundCase, vatForm, receipt) {
    return dispatch => {
        dispatch(uploadingDocumentation());
        Api.uploadDocumentation(refundCase, vatForm, receipt).then(() => {
            dispatch(uploadDocumentationSuccess());
            dispatch(requestRefund(refundCase));
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
            dispatch(requestingRefundSuccess());
            dispatch(getSelectedRefundCase(refundCase.id));
            dispatch(getRefundCases());
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(requestingRefundError(strings('refund_case.request_refund_error')));
            }
        });
    };
}

function createRefundCase(customerId, receiptNumber, amount, customerSignature, merchantSignature, successModal) {
    return dispatch => {
        dispatch(creatingRefundCase());
        Api.postRefundCase(customerId, receiptNumber, amount, customerSignature, merchantSignature).then(() => {
            dispatch(createRefundCaseSuccess());
            dispatch(openModal(successModal));
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else if (response.status === 400) {
                dispatch(createRefundCaseError(strings('refund_case.refund_case_already_claimed')));
            }
            else {
                dispatch(createRefundCaseError(strings('refund_case.claim_refund_case_error')));
            }
        });
    };
}

function creatingRefundCase() {
    return {
        type: types.REFUND_CREATING_REFUND_CASE
    };
}

function createRefundCaseSuccess() {
    return {
        type: types.REFUND_CREATE_REFUND_CASE_SUCCESS
    };
}

function createRefundCaseError(createRefundCaseError = '') {
    return {
        type: types.REFUND_CREATE_REFUND_CASE_ERROR,
        createRefundCaseError
    };
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

function getSelectedRefundCase(refundCaseId) {
    return dispatch => {
        dispatch(gettingRefundCases());
        Api.getRefundCaseById(refundCaseId).then((refundCases) => {
            dispatch(getSelectedRefundCaseSuccess(refundCases));
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(getRefundCasesError('Some error text'));
            }
        });
    };
}

function getSelectedRefundCaseSuccess(refundCase) {
    return {
        type: types.REFUND_GET_SELECTED_REFUND_CASE,
        refundCase
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

function getScannedUser(id, modalName) {
    return dispatch => {
        dispatch(gettingUser());
        Api.getUserById(id).then((user) => {
            dispatch(getOtherUserSuccess(user));
            dispatch(openModal(modalName));
        }).catch((response) => {
            if (shouldLogout(response)) {
                dispatch(logout());
            } else {
                dispatch(getOtherUserError('Could not get user'));
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

function getOtherUserSuccess(otherUser) {
    return {
        type: types.AUTH_GET_OTHER_USER_SUCCESS,
        otherUser
    };
}

function getUserError(error = '') {
    return {
        type: types.AUTH_GET_USER_ERROR,
        error
    };
}

function getOtherUserError(error = '') {
    return {
        type: types.AUTH_GET_OTHER_USER_ERROR,
        error
    };
}

function changePassword(oldPassword, newPassword, confPassword) {
    const passError = Validation.checkPassword(newPassword, confPassword);
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

function shouldLogout(response) {
    return response && response.status === 401 || response.status === 403;
}




