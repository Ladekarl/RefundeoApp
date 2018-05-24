import React, {Component} from 'react';
import {Platform, StatusBar, Text, TextInput} from 'react-native';
import {Provider} from 'react-redux';
import {configureStore} from './store';
import AppNavigator from './navigation/AppNavigator';
import {PersistGate} from 'redux-persist/integration/react';

const {store, persistor} = configureStore();

export default class App extends Component {

    constructor(props) {
        super(props);
        this._setDefaultFontFamily();
    }

    _setDefaultFontFamily = () => {
        let components = [Text, TextInput];

        const customProps = {
            style: {
                fontFamily: 'Lato'
            }
        };

        for (let i = 0; i < components.length; i++) {
            const TextRender = components[i].prototype.render;
            const initialDefaultProps = components[i].prototype.constructor.defaultProps;
            components[i].prototype.constructor.defaultProps = {
                ...initialDefaultProps,
                ...customProps,
            };
            components[i].prototype.render = function render() {
                let oldProps = this.props;
                // eslint-disable-next-line react/prop-types
                this.props = {...this.props, style: [customProps.style, this.props.style]};
                try {
                    return TextRender.apply(this, arguments);
                } finally {
                    this.props = oldProps;
                }
            };
        }
    };

    render() {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content', true);
        }
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppNavigator/>
                </PersistGate>
            </Provider>
        );
    }
}