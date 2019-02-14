import navigationReducer from './NavigationReducer';
import authReducer from './AuthReducer';
import refundReducer from './RefundReducer';
import merchantReducer from './MerchantReducer';
import cityReducer from './CityReducer';

const rootReducer = {
    navigationReducer,
    authReducer,
    refundReducer,
    merchantReducer,
    cityReducer
};

export default rootReducer;