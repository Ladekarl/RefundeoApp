import React, {PureComponent} from 'react';
import {TextInput, StyleSheet} from 'react-native';

export default class CustomTextInput extends PureComponent {

    static propTypes = TextInput.propTypes;

    static defaultProps = TextInput.defaultProps;

    textInput;

    focus() {
        this.textInput.focus();
    }

    render() {
        const props = this.props;
        return (
            <TextInput ref={(input) => this.textInput = input} {...props} style={[styles.textStyle, this.props.style]}/>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: 'Lato'
    }
});