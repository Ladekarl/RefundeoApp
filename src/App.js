import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, Text, TextInput} from 'react-native';
import colors from './shared/colors';
import {Provider} from 'react-redux';
import {configureStore} from './store';
import AppNavigator from './navigation/AppNavigator';

const store = configureStore();

export default class App extends Component {

    constructor(props) {
        super(props);
        this.setDefaultFontFamily();
    }

    setDefaultFontFamily = () => {
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
                ...customProps
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
                <AppNavigator style={styles.container}/>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    }
});