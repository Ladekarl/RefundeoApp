import React, {PureComponent} from 'react';
import {Text, StyleSheet} from 'react-native';

export default class CustomText extends PureComponent {

    static propTypes = {
        ...Text.propTypes
    };

    static defaultProps = {
        style: {}
    };

    render() {
        const {style, ...textProps} = this.props;
        return (
            <Text style={[styles.textStyle, style]} {...textProps}/>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: 'Lato'
    }
});