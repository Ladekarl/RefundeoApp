import types from '../actions/ActionTypes';

export type Merchant = {
    id: string,
    companyName: string,
    cvrNumber: string,
    refundPercentage: number,
    addressCity: string,
    addressStreetNumber: string,
    addressStreetName: string,
    addressCountry: string,
    addressPostalCode: string,
    logo: string,
    banner: string,
    description: string,
    openingHours: string,
    latitude: number,
    longitude: number
}

type MerchantReducer = {
    merchants: Array<Merchant>,
    selectedMerchant: Merchant,
    fetchingMerchants: boolean,
    getMerchantsError: string
}

const initialState: MerchantReducer = {
    merchants: [],
    selectedMerchant: {},
    fetchingMerchants: false,
    getMerchantsError: ''
};

export default function merchantReducer(state = initialState, action = {}) {
    let nextState = null;
    switch (action.type) {
        case types.MERCHANT_GETTING_MERCHANTS: {
            nextState = {
                ...state,
                fetchingMerchants: true,
                getMerchantsError: ''
            };
            break;
        }
        case types.MERCHANT_GET_MERCHANTS_SUCCESS: {
            nextState = {
                ...state,
                fetchingMerchants: false,
                getMerchantsError: '',
                merchants: action.merchants
            };
            break;
        }
        case types.MERCHANT_GET_MERCHANTS_ERROR: {
            nextState = {
                ...state,
                fetchingMerchants: false,
                getMerchantsError: action.error
            };
            break;
        }
        case types.MERCHANT_SELECT_MERCHANT: {
            nextState = {
                ...state,
                selectedMerchant: action.merchant
            };
            break;
        }
    }
    return nextState || state;
}