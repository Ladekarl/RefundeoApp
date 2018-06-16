import navigationReducer from './NavigationReducer';
import authReducer from './AuthReducer';
import refundReducer from './RefundReducer';
import merchantReducer from './MerchantReducer';

const rootReducer = {
    navigationReducer,
    authReducer,
    refundReducer,
    merchantReducer
};

export default rootReducer;