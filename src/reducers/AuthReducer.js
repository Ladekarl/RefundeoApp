import types from '../actions/ActionTypes';

const initialState = {
    loggedIn: false,
    fetching: false,
    loginError: '',
    changeUserError: '',
    changePasswordError: '',
    facebookLoginError: '',
    getUserError: '',
    user: {
        id: '',
        token: '',
        expiration: '',
        username: '',
        firstName: '',
        lastName: '',
        country: '',
        bankAccountNumber: '',
        bankRegNumber: '',
        isOauth: false,
        acceptedPrivacyPolicy: false,
        privacyPolicy: '',
        refreshToken: ''
    }
};


const resetErrors = {
    changeUserError: '',
    changePasswordError: '',
    facebookLoginError: '',
    getUserError: ''
};

export default function authReducer(state = initialState, action = {}) {
    let nextState = null;
    switch (action.type) {
        case types.AUTH_GETTING_USER:
        case types.AUTH_CHANGING_USER:
        case types.AUTH_CHANGING_PASSWORD:
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
        case types.AUTH_GET_USER_SUCCESS:
        case types.AUTH_LOGIN_SUCCESS: {
            nextState = {
                ...state,
                user: action.user,
                fetching: false,
                ...resetErrors
            };
            break;
        }
        case types.AUTH_LOGOUT_SUCCESS: {
            nextState = {
                ...state,
                fetching: false,
                user: initialState.user,
                ...resetErrors
            };
            break;
        }
        case types.AUTH_CHANGE_USER_SUCCESS: {
            nextState = {
                ...state,
                fetching: false,
                user: action.user,
                ...resetErrors
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
    }
    return nextState || state;
}