import React, {Component} from 'react';
import {Platform, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {configureStore} from './navigation/AppNavigator';
import Orientation from 'react-native-orientation';
import Root from './Root';

const store = configureStore();

if((process.env.NODE_ENV || '').toLowerCase() === 'production'){
    // disable console. log in production
// eslint-disable-next-line no-console
    console.log = function () {};
// eslint-disable-next-line no-console
    console.info = function () {};
// eslint-disable-next-line no-console
    console.warn = function () {};
// eslint-disable-next-line no-console
    console.error = function () {};
// eslint-disable-next-line no-console
    console.debug = function () {};
}

export default class App extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Orientation.lockToPortrait();
    }

    function;

    render() {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content', true);
        }
        return (
            <Provider store={store}>
                <Root/>
            </Provider>
        );
    }
}