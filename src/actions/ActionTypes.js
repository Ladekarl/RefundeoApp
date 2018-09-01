const types = {
    // Navigation actions
    NAVIGATE_LOGGED_IN: 'NAVIGATE_LOGGED_IN',
    NAVIGATE_LOGGED_OUT: 'NAVIGATE_LOGGED_OUT',
    NAVIGATE_LOG_IN: 'NAVIGATE_LOG_IN',
    NAVIGATE_LOG_OUT: 'NAVIGATE_LOG_OUT',
    NAVIGATE_REGISTER: 'NAVIGATE_REGISTER',
    NAVIGATE_REGISTER_EXTRA: 'NAVIGATE_REGISTER_EXTRA',
    NAVIGATE_REGISTER_EXTRA_RESET: 'NAVIGATE_REGISTER_EXTRA_RESET',
    NAVIGATE_BACK: 'NAVIGATE_BACK',
    NAVIGATE_OPEN_DRAWER: 'NAVIGATE_OPEN_DRAWER',
    NAVIGATE_CLOSE_DRAWER: 'NAVIGATE_CLOSE_DRAWER',
    NAVIGATE_TOGGLE_DRAWER: 'NAVIGATE_TOGGLE_DRAWER',
    NAVIGATE_SETTINGS: 'NAVIGATE_SETTINGS',
    NAVIGATE_DRAWER_SETTINGS: 'NAVIGATE_DRAWER_SETTINGS',
    NAVIGATE_DRAWER_HOME: 'NAVIGATE_DRAWER_HOME',
    NAVIGATE_OPEN_MODAL: 'NAVIGATE_OPEN_MODAL',
    NAVIGATE_CLOSE_MODAL: 'NAVIGATE_CLOSE_MODAL',
    NAVIGATE_SCANNER: 'NAVIGATE_SCANNER',
    NAVIGATE_QR_CODE: 'NAVIGATE_QR_CODE',
    NAVIGATE_OVERVIEW: 'NAVIGATE_OVERVIEW',
    NAVIGATE_STORE_MAP: 'NAVIGATE_STORE_MAP',
    NAVIGATE_STORE_LIST: 'NAVIGATE_STORE_LIST',
    NAVIGATE_HELP: 'NAVIGATE_HELP',
    NAVIGATE_STORE_PROFILE: 'NAVIGATE_STORE_PROFILE',
    NAVIGATE_REFUND_CASE: 'NAVIGATE_REFUND_CASE',
    NAVIGATE_UPLOAD_DOCUMENTATION: 'NAVIGATE_UPLOAD_DOCUMENTATION',
    NAVIGATE_GUIDE: 'NAVIGATE_GUIDE',
    NAVIGATE_CONTACT: 'NAVIGATE_CONTACT',
    NAVIGATE_ADD_CITY: 'NAVIGATE_ADD_CITY',
    NAVIGATE_CITIES: 'NAVIGATE_CITIES',

    // Auth actions
    AUTH_LOGGING_IN: 'AUTH_LOGGING_IN',
    AUTH_LOGIN_ERROR: 'AUTH_LOGIN_ERROR',
    AUTH_FACEBOOK_LOGIN_ERROR: 'AUTH_FACEBOOK_LOGIN_ERROR',
    AUTH_LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
    AUTH_LOGOUT_SUCCESS: 'AUTH_LOGOUT_SUCCESS',
    AUTH_REGISTERING: 'AUTH_REGISTERING',
    AUTH_REGISTER_SUCCESS: 'AUTH_REGISTER_SUCCESS',
    AUTH_REGISTER_ERROR: 'AUTH_REGISTER_ERROR',
    AUTH_CHANGING_USER: 'SETTINGS_CHANGING_FIRSTNAME',
    AUTH_CHANGE_USER_SUCCESS: 'SETTINGS_CHANGE_PROPERTY_SUCCESS',
    AUTH_CHANGE_USER_ERROR: 'SETTINGS_CHANGE_PROPERTY_ERROR',
    AUTH_CHANGING_PASSWORD: 'AUTH_CHANGING_PASSWORD',
    AUTH_CHANGE_PASSWORD_SUCCESS: 'SETTINGS_CHANGING_PASSWORD_SUCCESS',
    AUTH_CHANGE_PASSWORD_ERROR: 'SETTINGS_CHANGING_PASSWORD_ERROR',
    AUTH_GETTING_USER: 'AUTH_GETTING_USER',
    AUTH_GET_USER_SUCCESS: 'AUTH_GET_USER_SUCCESS',
    AUTH_GET_USER_ERROR: 'AUTH_GET_USER_ERROR',
    AUTH_GETTING_OTHER_USER: 'AUTH_GETTING_OTHER_USER',
    AUTH_GET_OTHER_USER_SUCCESS: 'AUTH_GET_OTHER_USER_SUCCESS',
    AUTH_GET_OTHER_USER_ERROR: 'AUTH_GET_OTHER_USER_ERROR',
    AUTH_STOP_FETCHING: 'AUTH_STOP_FETCHING',
    AUTH_POSTING_FORGOT_PASSWORD: 'AUTH_POSTING_FORGOT_PASSWORD',
    AUTH_FORGOT_PASSWORD_SUCCESS: 'AUTH_FORGOT_PASSWORD_SUCCESS',
    AUTH_FORGOT_PASSWORD_ERROR: 'AUTH_FORGOT_PASSWORD_ERROR',

    // Refund Case actions
    REFUND_GETTING_REFUND_CASES: 'REFUND_GETTING_REFUND_CASES',
    REFUND_GET_REFUND_CASES_SUCCESS: 'REFUND_GET_REFUND_CASES_SUCCESS',
    REFUND_GET_REFUND_CASES_ERROR: 'REFUND_GET_REFUND_CASES_ERROR',
    REFUND_UPLOADING_DOCUMENTATION: 'REFUND_UPLOADING_DOCUMENTATION',
    REFUND_UPLOAD_DOCUMENTATION_SUCCESS: 'REFUND_UPLOAD_DOCUMENTATION_SUCCESS',
    REFUND_UPLOAD_DOCUMENTATION_ERROR: 'REFUND_UPLOAD_DOCUMENTATION_ERROR',
    REFUND_REQUESTING_REFUND: 'REFUND_REQUESTING_REFUND',
    REFUND_REQUEST_REFUND_SUCCESS: 'REFUND_REQUEST_REFUND_SUCCESS',
    REFUND_REQUEST_REFUND_ERROR: 'REFUND_REQUEST_REFUND_ERROR',
    REFUND_CREATING_REFUND_CASE: 'REFUND_CREATING_REFUND_CASE',
    REFUND_CREATE_REFUND_CASE_SUCCESS: 'REFUND_CREATE_REFUND_CASE_SUCCESS',
    REFUND_CREATE_REFUND_CASE_ERROR: 'REFUND_CREATE_REFUND_CASE_ERROR',
    REFUND_SELECT_REFUND_CASE: 'REFUND_SELECT_REFUND_CASE',
    REFUND_SELECT_UPLOAD_DOCUMENTATION: 'REFUND_SELECT_UPLOAD_DOCUMENTATION',
    REFUND_UPLOAD_TEMP_VAT_FORM_IMAGE: 'REFUND_UPLOAD_TEMP_VAT_FORM_IMAGE',
    REFUND_UPLOAD_TEMP_RECEIPT_IMAGE: 'REFUND_UPLOAD_TEMP_RECEIPT_IMAGE',
    REFUND_GET_SELECTED_REFUND_CASE: 'REFUND_GET_SELECTED_REFUND_CASE',
    REFUND_SEND_EMAIL_ERROR: 'REFUND_SEND_EMAIL_ERROR',
    REFUND_SEND_EMAIL_SUCCESS: 'REFUND_SEND_EMAIL_SUCCESS',
    REFUND_SENDING_EMAIL: 'REFUND_SENDING_EMAIL',

    // Merchant actions
    MERCHANT_GETTING_MERCHANTS: 'MERCHANT_GETTING_MERCHANTS',
    MERCHANT_GET_MERCHANTS_SUCCESS: 'MERCHANT_GET_MERCHANTS_SUCCESS',
    MERCHANT_GET_MERCHANTS_ERROR: 'MERCHANT_GET_MERCHANTS_ERROR',
    MERCHANT_SELECT_MERCHANT: 'MERCHANT_SELECT_MERCHANT',
    MERCHANT_CHANGE_FILTER_VALUE: 'MERCHANT_CHANGE_FILTER_VALUE',
    MERCHANT_GET_TAGS_SUCCESS: 'MERCHANT_GET_TAGS_SUCCESS',

    // City actions
    CITY_GETTING_CITIES: 'CITY_GETTING_CITIES',
    CITY_GET_CITIES_SUCCESS: 'CITY_GET_CITIES_SUCCESS',
    CITY_GET_CITIES_ERROR: 'CITY_GET_CITIES_ERROR',
    CITY_GETTING_CITY: 'CITY_GETTING_CITY',
    CITY_GET_CITY_SUCCESS: 'CITY_GET_CITY_SUCCESS',
    CITY_GET_CITY_ERROR: 'CITY_GET_CITY_ERROR',
    CITY_ADDING_CITY: 'CITY_ADDING_CITY',
    CITY_ADD_CITY_SUCCESS: 'CITY_ADD_CITY_SUCCESS',
    CITY_ADD_CITY_ERROR: 'CITY_ADD_CITY_ERROR',
    CITY_SELECT_CITY: 'CITY_SELECT_CITY'

};

export default types;