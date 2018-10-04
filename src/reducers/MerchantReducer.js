import types from '../actions/ActionTypes';

export type Merchant = {
    companyName: string,
    cvrNumber: string,
    refundPercentage: number,
    priceLevel: number,
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
    currency: string,
    vatNumber: string,
    tags: Array<Tag>,
    openingHours: Array<OpeningHours>
}

type OpeningHours = {
    day: number,
    close: string,
    open: string
}

type MerchantReducer = {
    merchants: Array<Merchant>,
    selectedMerchant: Merchant,
    fetchingMerchants: boolean,
    getMerchantsError: string,
    filterDistanceSliderValue: number,
    filterRefundSliderValue: number,
    filterOnlyOpenValue: boolean,
    filterTag: Tag,
    tags: Array<Tag>
}

type Tag = {
    key: number,
    value: string,
    displayName: string
}

const initialState: MerchantReducer = {
    merchants: [],
    selectedMerchant: {},
    fetchingMerchants: false,
    getMerchantsError: '',
    filterDistanceSliderValue: 10000,
    filterRefundSliderValue: 0,
    filterOnlyOpenValue: false,
    filterTag: {},
    tags: []
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
        case types.MERCHANT_CHANGE_FILTER_VALUE: {
            nextState = {
                ...state,
                filterDistanceSliderValue: action.distanceSliderValue,
                filterRefundSliderValue: action.refundSliderValue,
                filterOnlyOpenValue: action.onlyOpenValue,
                filterTag: action.tagValue
            };
            break;
        }
        case types.MERCHANT_GET_TAGS_SUCCESS: {
            nextState = {
                ...state,
                tags: action.tags
            };
            break;
        }
        case types.AUTH_LOGOUT_SUCCESS: {
            nextState = {
                ...initialState
            };
            break;
        }
        default: {
            nextState = state;
        }
    }
    return nextState || state;
}