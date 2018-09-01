import React, {PureComponent} from 'react';
import {Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class CustomText extends PureComponent {

    static propTypes = {
        children: PropTypes.any,
        style: Text.propTypes.style
    };

    static defaultProps = {
        children: '',
        style: {}
    };

    render() {
        return (
            <Text style={[styles.textStyle, this.props.style]}>{this.props.children}</Text>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
            fontFamily: 'Lato'
    }
});