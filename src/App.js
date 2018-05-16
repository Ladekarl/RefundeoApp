import React, {Component} from 'react';
import {Platform, StatusBar} from 'react-native';
import colors from './shared/colors';
import {
    setCustomActivityIndicator,
    setCustomText,
    setCustomTextInput,
    setCustomTouchableOpacity,
} from 'react-native-global-props';
import {Provider} from 'react-redux';
import {configureStore} from './store';
import AppNavigator from './navigation/AppNavigator';

const store = configureStore();

export default class App extends Component {

    constructor(props) {
        super(props);

        const customTextProps = {
            style: {
                fontFamily: 'Lato'
            }
        };
        const customTouchableOpacityProps = {
            hitSlop: {top: 15, right: 15, left: 15, bottom: 15}
        };
        const customActivityIndicator = {
            color: colors.activeTabColor
        };

        setCustomText(customTextProps);
        setCustomTouchableOpacity(customTouchableOpacityProps);
        setCustomActivityIndicator(customActivityIndicator);
        setCustomTextInput(customTextProps);
    }

    render() {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content', true);
        }
        return (
            <Provider store={store}>
                <AppNavigator/>
            </Provider>
        );
    }
}