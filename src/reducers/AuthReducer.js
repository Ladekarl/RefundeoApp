import types from '../actions/ActionTypes';

const initialState = {
    loggedIn: false,
    fetching: false,
    loginError: '',
    facebookLoginError: '',
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
        refreshToken: ''
    }
};

export default function authReducer(state = initialState, action = {}) {
    let nextState = null;
    switch (action.type) {
        case types.AUTH_LOGGING_IN: {
            nextState = {
                ...state,
                fetching: true
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
        case types.AUTH_LOGIN_SUCCESS: {
            nextState = {
                ...state,
                user: action.user,
                fetching: false
            };
            break;
        }
        case types.AUTH_LOGOUT_SUCCESS: {
            nextState = {
                ...state,
                fetching: false,
                user: initialState.user
            }
        }
    }
    return nextState || state;
}