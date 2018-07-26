import React, {PureComponent} from 'react';
import {TextInput, StyleSheet} from 'react-native';

export default class CustomTextInput extends PureComponent {

    static propTypes = TextInput.propTypes;

    static defaultProps = TextInput.defaultProps;

    render() {
        const props = this.props;
        return (
            <TextInput {...props} style={[styles.textStyle, this.props.style]}/>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: 'Lato'
    }
});