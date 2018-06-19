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
    longitude: number,
    distance: number,
    vatNumber: string
}

type MerchantReducer = {
    merchants: Array<Merchant>,
    selectedMerchant: Merchant,
    fetchingMerchants: boolean,
    getMerchantsError: string,
    filterDistanceSliderValue: Array<number>,
    filterRefundSliderValue: Array<number>
}

const initialState: MerchantReducer = {
    merchants: [],
    selectedMerchant: {},
    fetchingMerchants: false,
    getMerchantsError: '',
    filterDistanceSliderValue: [0, 10000],
    filterRefundSliderValue: [0, 100],
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
        case types.MERCHANT_CHANGE_FILTER_REFUND_SLIDER_VALUE: {
            nextState = {
                ...state,
                filterRefundSliderValue: action.sliderValue
            };
            break;
        }
        case types.MERCHANT_CHANGE_FILTER_DISTANCE_SLIDER_VALUE: {
            nextState = {
                ...state,
                filterDistanceSliderValue: action.sliderValue
            };
            break;
        }
    }
    return nextState || state;
}