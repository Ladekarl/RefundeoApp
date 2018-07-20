import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BackHandler} from 'react-native';
import PropTypes from 'prop-types';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {RootNavigator} from './NavigationConfiguration';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from 'react-navigation-redux-helpers';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const navigationMiddleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.navigationReducer,
);

const App = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        navigation,
        state: {
            ...state.navigationReducer
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch),
        dispatch
    };
};

const AppWithNavigationState = connect(
    mapStateToProps
)(App);

const reducer = combineReducers(rootReducer);

const configureStore = () => {
    const store = createStore(
        reducer,
        applyMiddleware(navigationMiddleware, thunk)
    );

    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = combineReducers(require('../reducers/index').default);
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};


class AppNavigatorScreen extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        navigation: PropTypes.shape().isRequired,
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.backHandlerSub = BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        this.backHandlerSub.remove();
    }

    _handleBackPress = () => {
        if (this.props.state.drawerOpen) {
            this.props.actions.closeDrawer();
            return true;
        }
        if (this._shouldCloseApp(this.props.navigation)) {
            return false;
        }
        this.props.actions.navigateBack();
        return true;
    };

    _shouldCloseApp = (nav) => {
        if (nav.index > 0) return false;

        if (nav.routes) {
            return nav.routes.every(this._shouldCloseApp);
        }

        return true;
    };

    render() {
        return (
            <AppWithNavigationState/>
        );
    }
}

const AppNavigator = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppNavigatorScreen);

export {
    configureStore,
    AppNavigator
};