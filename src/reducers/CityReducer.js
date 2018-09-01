import types from '../actions/ActionTypes';
import type Merchant from './MerchantReducer';

const resetErrors = {
    getCitiesError: '',
    getCityError: '',
    addCityError: ''
};

const initialState: CityReducer = {
    cities: new Map(),
    fetchingCities: false,
    fetchingCity: false,
    selectedCity: undefined,
    ...resetErrors
};

type CityReducer = {
    cities: Map<string, City>,
    fetchingCities: boolean,
    getCitiesError: string,
    fetchingCity: boolean,
    getCityError: string,
    addCityError: string,
    selectedCity: City
}

export type City = {
    name: string,
    image: string,
    googlePlaceId: string,
    Latitude: number,
    Longitude: number,
    merchants: Array<Merchant>
}

export default function cityReducer(state = initialState, action = {}) {
    let nextState = null;

    switch (action.type) {
        case types.CITY_GETTING_CITIES: {
            nextState = {
                ...state,
                ...resetErrors,
                fetchingCities: true
            };
            break;
        }
        case types.CITY_GET_CITIES_SUCCESS: {
            nextState = {
                ...state,
                ...resetErrors,
                cities: new Map(action.cities.map(c => [c.googlePlaceId, c])),
                fetchingCities: false
            };
            break;
        }
        case types.CITY_GET_CITIES_ERROR: {
            nextState = {
                ...state,
                ...resetErrors,
                fetchingCities: false,
                getCitiesError: action.error
            };
            break;
        }
        case types.CITY_GETTING_CITY: {
            nextState = {
                ...state,
                ...resetErrors,
                fetchingCity: true
            };
            break;
        }
        case types.CITY_ADD_CITY_SUCCESS:
        case types.CITY_GET_CITY_SUCCESS: {
            const cities = new Map(state.cities);
            const city: City = action.city;
            cities.set(city.googlePlaceId, city);
            nextState = {
                ...state,
                ...resetErrors,
                cities,
                fetchingCity: false
            };
            break;
        }
        case types.CITY_GET_CITY_ERROR: {
            nextState = {
                ...state,
                ...resetErrors,
                getCityError: action.error,
                fetchingCity: false
            };
            break;
        }
        case types.CITY_ADDING_CITY: {
            nextState = {
                ...state,
                ...resetErrors,
                fetchingCity: true
            };
            break;
        }
        case types.CITY_ADD_CITY_ERROR: {
            nextState = {
                ...state,
                ...resetErrors,
                fetchingCity: false,
                addCityError: action.error
            };
            break;
        }
        case types.CITY_SELECT_CITY: {
            nextState = {
                ...state,
                resetErrors,
                selectedCity: action.city
            };
            break;
        }
        default: {
            nextState = state;
        }
    }
    return nextState || state;
}