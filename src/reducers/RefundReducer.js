import types from '../actions/ActionTypes';

type Merchant = {
    id: string,
    companyName: string,
    cvrNumber: string,
    refundPercentage: number
}

type Customer = {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    country: string
}

type RefundCase = {
    id: number,
    amount: number,
    refundAmount: number,
    isRequested: boolean,
    isAccepted: boolean,
    qrCode: string,
    documentation: string,
    dateCreated: string,
    dateRequested: string,
    merchant: Merchant,
    customer: Customer,
    companyName: string,
}

type RefundReducerState = {
    refundCases: Array<RefundCase>,
    fetchingRefundCases: boolean,
    getRefundCasesError: string
}

const initialState: RefundReducerState = {
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