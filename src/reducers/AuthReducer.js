import types from '../actions/ActionTypes';

const initialState = {
    loggedIn: false,
    fetching: false,
    loginError: '',
    changeUserError: '',
    changePasswordError: '',
    facebookLoginError: '',
    forgotPasswordError: '',
    getUserError: '',
    registerError: '',
    forgotPasswordEmail: '',
    user: {
        id: '',
        token: '',
        expiration: '',
        username: '',
        firstName: '',
        lastName: '',
        country: '',
        email: '',
        phone: '',
        swift: '',
        accountNumber: '',
        passport: '',
        addressCity: '',
        addressStreetNumber: '',
        addressStreetName: '',
        addressPostalCode: '',
        addressCountry: '',
        isOauth: false,
        acceptedPrivacyPolicy: false,
        acceptedTermsOfService: false,
        privacyPolicyVersion: 0,
        termsOfServiceVersion: 0,
        refreshToken: '',
        isMerchant: false,
    },
    otherUser: {
        id: '',
        firstName: '',
        lastName: '',
        country: '',
        email: ''
    }
};


const resetErrors = {
    changeUserError: '',
    changePasswordError: '',
    facebookLoginError: '',
    getUserError: '',
    registerError: '',
    loginError: '',
    forgotPasswordError: ''
};

export default function authReducer(state = initialState, action = {}) {
    let nextState = null;
    switch (action.type) {
        case types.AUTH_REGISTERING:
        case types.AUTH_GETTING_USER:
        case types.AUTH_GETTING_OTHER_USER:
        case types.AUTH_CHANGING_USER:
        case types.AUTH_CHANGING_PASSWORD:
        case types.AUTH_POSTING_FORGOT_PASSWORD:
        case types.AUTH_LOGGING_IN: {
            nextState = {
                ...state,
                fetching: true,
                ...resetErrors
            };
            break;
        }
        case types.AUTH_LOGIN_ERROR: {
            nextState = {
                ...state,
                loginError: action.loginError,
                fetching: false
            };
            break;
        }
        case types.AUTH_FACEBOOK_LOGIN_ERROR: {
            nextState = {
                ...state,
                facebookLoginError: action.facebookLoginError,
                fetching: false
            };
            break;
        }
        case types.AUTH_REGISTER_ERROR: {
            nextState = {
                ...state,
                registerError: action.registerError,
                fetching: false
            };
            break;
        }
        case types.AUTH_REGISTER_SUCCESS:
        case types.AUTH_GET_USER_SUCCESS: {
            nextState = {
                ...state,
                user: action.user,
                fetching: false,
                ...resetErrors
            };
            break;
        }
        case types.AUTH_LOGIN_SUCCESS: {
            nextState = {
                ...state,
                user: action.user,
                ...resetErrors
            };
            break;
        }
        case types.AUTH_STOP_FETCHING: {
            nextState = {
                ...state,
                fetching: false
            };
            break;
        }
        case types.AUTH_GET_OTHER_USER_SUCCESS: {
            nextState = {
                ...state,
                otherUser: action.otherUser,
                fetching: false,
                ...resetErrors
            };
            break;
        }
        case types.AUTH_LOGOUT_SUCCESS: {
            nextState = {
                ...initialState
            };
            break;
        }
        case types.AUTH_CHANGE_USER_SUCCESS: {
            nextState = {
                ...state,
                ...resetErrors,
                user: action.user,
                fetching: false,
            };
            break;
        }
        case types.AUTH_CHANGE_USER_ERROR: {
            nextState = {
                ...state,
                changeUserError: action.error,
                fetching: false,
            };
            break;
        }
        case types.AUTH_GET_OTHER_USER_ERROR:
        case types.AUTH_GET_USER_ERROR: {
            nextState = {
                ...state,
                getUserError: action.error,
                fetching: false
            };
            break;
        }
        case types.AUTH_CHANGE_PASSWORD_SUCCESS: {
            nextState = {
                ...state,
                fetching: false,
                ...resetErrors
            };
            break;
        }
        case types.AUTH_CHANGE_PASSWORD_ERROR: {
            nextState = {
                ...state,
                fetching: false,
                changePasswordError: action.error
            };
            break;
        }
        case types.NAVIGATE_REGISTER_EXTRA:
        case types.NAVIGATE_LOGGED_IN: {
            nextState = {
                ...state,
                fetching: false,
                ...resetErrors
            };
            break;
        }
        case types.AUTH_FORGOT_PASSWORD_ERROR: {
            nextState = {
                ...state,
                fetching: false,
                forgotPasswordError: action.error
            };
            break;
        }
        case types.AUTH_FORGOT_PASSWORD_SUCCESS: {
            nextState = {
                ...state,
                fetching: false,
                forgotPasswordEmail: action.forgotPasswordEmail,
                ...resetErrors
            };
            break;
        }
        default: {
            nextState = state;
        }
    }
    return nextState || state;
}