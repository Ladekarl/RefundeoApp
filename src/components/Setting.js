import React, {PureComponent} from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View, ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';

export default class Setting extends PureComponent {

    static propTypes = {
        onPress: PropTypes.func,
        required: PropTypes.bool,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
        containerStyle: ViewPropTypes.style,
        contentContainerStyle: ViewPropTypes.style,
        labelStyle: Text.propTypes.style
    };

    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        required: false,
        onPress: null,
        containerStyle: {},
        contentContainerStyle: {},
        labelStyle: {}
    };

    render() {
        const {
            onPress,
            required,
            label,
            value,
            containerStyle,
            contentContainerStyle,
            labelStyle
        } = this.props;

        return (
            <TouchableOpacity disabled={!onPress} style={[styles.rowContainer, containerStyle]} onPress={onPress}>
                <View style={[styles.rowInnerContainer, contentContainerStyle]}>
                    {required && !value &&
                    <Icon name='exclamation-circle' style={styles.requiredIcon}/>
                    }
                    <Text style={[styles.leftText, labelStyle]}>{label}</Text>
                </View>
                {value &&
                <Text style={styles.rightText}>{value}</Text>
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    rowInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    requiredIcon: {
        fontSize: 15,
        height: undefined,
        width: undefined,
        color: colors.cancelButtonColor
    },
    leftText: {
        marginLeft: 10
    },
    rightText: {
        marginRight: 10,
        color: colors.submitButtonColor
    }
});