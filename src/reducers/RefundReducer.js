import types from '../actions/ActionTypes';

type Merchant = {
    id: string,
    companyName: string,
    cvrNumber: string,
    refundPercentage: number,
    AddressCity: string,
    AddressStreetNumber: string,
    AddressStreetName: string,
    AddressCountry: string,
    AddressPostalCode: string,
    Latitude: number,
    Longitude: number
}

type Customer = {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    country: string,
}

type RefundCase = {
    id: number,
    amount: number,
    refundAmount: number,
    isRequested: boolean,
    isAccepted: boolean,
    isRejected: boolean,
    qrCode: string,
    documentation: string,
    dateCreated: string,
    dateRequested: string,
    merchant: Merchant,
    customer: Customer
}

type RefundReducerState = {
    refundCases: Array<RefundCase>,
    fetchingRefundCases: boolean,
    getRefundCasesError: string
}

const initialState: RefundReducerState = {
    refundCases: [],
    fetchingRefundCases: false,
    fetchingDocumentation: false,
    fetchingRequestRefund: false,
    fetchingClaimRefundCase: false,
    getRefundCasesError: '',
    documentationError: '',
    requestRefundError: '',
    claimRefundCaseError: ''
};

export default function refundReducer(state = initialState, action = {}) {
    let nextState = null;
    switch (action.type) {
        case types.REFUND_GETTING_REFUND_CASES:
            nextState = {
                ...state,
                fetchingRefundCases: true,
                getRefundCasesError: ''
            };
            break;
        case types.REFUND_GET_REFUND_CASES_SUCCESS:
            nextState = {
                ...state,
                fetchingRefundCases: false,
                refundCases: action.refundCases,
                getRefundCasesError: ''
            };
            break;
        case types.REFUND_GET_REFUND_CASES_ERROR:
            nextState = {
                ...state,
                fetchingRefundCases: false,
                getRefundCasesError: action.getRefundCasesError
            };
            break;
        case types.REFUND_UPLOADING_DOCUMENTATION:
            nextState = {
                ...state,
                fetchingDocumentation: true,
                documentationError: ''
            };
            break;
        case types.REFUND_UPLOAD_DOCUMENTATION_ERROR:
            nextState = {
                ...state,
                fetchingDocumentation: false,
                documentationError: action.documentationError
            };
            break;
        case types.REFUND_UPLOAD_DOCUMENTATION_SUCCESS:
            nextState = {
                ...state,
                fetchingDocumentation: false,
                documentationError: ''
            };
            break;
        case types.REFUND_REQUESTING_REFUND:
            nextState = {
                ...state,
                fetchingRequestRefund: true,
                requestRefundError: ''
            };
            break;
        case types.REFUND_REQUEST_REFUND_SUCCESS:
            nextState = {
                ...state,
                fetchingRequestRefund: false,
                requestRefundError: ''
            };
            break;
        case types.REFUND_REQUEST_REFUND_ERROR:
            nextState = {
                ...state,
                fetchingRequestRefund: false,
                requestRefundError: action.requestRefundError
            };
            break;
        case types.REFUND_CLAIMING_REFUND_CASE:
            nextState = {
                ...state,
                fetchingClaimRefundCase: true,
                claimRefundCaseError: ''
            };
            break;
        case types.REFUND_CLAIM_REFUND_CASE_SUCCESS:
            nextState = {
                ...state,
                fetchingClaimRefundCase: false,
                claimRefundCaseError: ''
            };
            break;
        case types.REFUND_CLAIM_REFUND_CASE_ERROR:
            nextState = {
                ...state,
                fetchingClaimRefundCase: false,
                claimRefundCaseError: action.claimRefundCaseError
            };
            break;
    }
    return nextState || state;
}