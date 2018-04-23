import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import {createReactNavigationReduxMiddleware, createReduxBoundAddListener} from 'react-navigation-redux-helpers';

export let addListener;

export function configureStore() {
    const reducer = combineReducers(rootReducer);

    const navigationMiddleware = createReactNavigationReduxMiddleware(
        'root',
        state => state.navigationReducer,
    );

    addListener = createReduxBoundAddListener('root');

    const store = createStore(
        reducer,
        applyMiddleware(thunk, navigationMiddleware)
    );
    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = combineReducers(require('../reducers/index').default);
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
}