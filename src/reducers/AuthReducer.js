import types from '../actions/ActionTypes';

const initialState = {
    loggedIn: false,
    fetching: false,
    error: ""
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
                fetching: false
            };
            break;
        }
        case types.AUTH_LOGIN_SUCCESS: {
            nextState = {
                ...state,
                fetching: false
            };
            break;
        }
    }
    return nextState || state;
}