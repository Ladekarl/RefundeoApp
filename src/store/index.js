import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import {createReactNavigationReduxMiddleware, createReduxBoundAddListener} from 'react-navigation-redux-helpers';
import {persistStore, persistReducer} from 'redux-persist';
import {AsyncStorage} from 'react-native';

export let addListener;

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const authPersistConfig = {
    key: 'authReducer',
    storage: AsyncStorage
};

const refundPersistConfig = {
    key: 'refundReducer',
    storage: AsyncStorage,
};

const merchantPersistConfig = {
    key: 'merchantReducer',
    storage: AsyncStorage,
};

export function configureStore() {

    const rootReducer = createRootReducer(reducers);

    const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

    const navigationMiddleware = createReactNavigationReduxMiddleware(
        'root',
        state => state.navigationReducer,
    );

    addListener = createReduxBoundAddListener('root');

    const store = createStore(
        persistedReducer,
        applyMiddleware(thunk, navigationMiddleware)
    );
    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = createRootReducer(require('../reducers/index').default);
            store.replaceReducer(nextRootReducer);
        });
    }
    let persistor = persistStore(store);
    return {store, persistor};
}

function createRootReducer(reducers) {
    return combineReducers({
        navigationReducer: reducers.navigationReducer,
        authReducer: persistReducer(authPersistConfig, reducers.authReducer),
        refundReducer: persistReducer(refundPersistConfig, reducers.refundReducer),
        merchantReducer: persistReducer(merchantPersistConfig, reducers.merchantReducer),
    });
}