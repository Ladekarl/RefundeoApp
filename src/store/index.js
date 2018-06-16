import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import {createReactNavigationReduxMiddleware, createReduxBoundAddListener} from 'react-navigation-redux-helpers';
import types from '../actions/ActionTypes';
import storage from 'redux-persist/lib/storage';
import {persistStore, persistReducer} from 'redux-persist';

export let addListener;

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['navigationReducer', 'authReducer', 'refundReducer', 'merchantReducer']
};

export function configureStore() {
    const appReducer = combineReducers(reducers);

    const rootReducer = (state, action) => {
        if (action.type === types.AUTH_LOGOUT_SUCCESS) {
            Object.keys(state).forEach(key => {
                storage.removeItem(`persist:${key}`);
            });
            state = undefined;
        }
        return appReducer(state, action);
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

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
            const nextRootReducer = combineReducers(require('../reducers/index').default);
            store.replaceReducer(nextRootReducer);
        });
    }
    let persistor = persistStore(store);
    return {store, persistor};
}