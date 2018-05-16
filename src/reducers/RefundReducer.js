import types from '../actions/ActionTypes';

const initialState = {
    refundCases: [],
    fetchingRefundCases: false,
    getRefundCasesError: ''
};

export default function refundReducer(state = initialState, action = {}) {
    let nextState = null;
    switch (action.type) {
        case types.REFUND_GETTING_REFUND_CASES:
            nextState = {
                ...state,
                fetchingRefundCases: true
            };
            break;
        case types.REFUND_GET_REFUND_CASES_SUCCESS:
            nextState = {
                ...state,
                fetchingRefundCases: false,
                refundCases: action.refundCases
            };
            break;
        case types.REFUND_GET_REFUND_CASES_ERROR:
            nextState = {
                ...state,
                fetchingRefundCases: false,
                getRefundCasesError: action.getRefundCasesError
            };
            break;
    }
    return nextState || state;
}