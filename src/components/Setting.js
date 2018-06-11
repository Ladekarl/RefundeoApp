import React, {Component} from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';

export default class Setting extends Component {

    static propTypes = {
        onPress: PropTypes.func,
        required: PropTypes.bool,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
        containerStyle: View.propTypes.style,
        contentContainerStyle: View.propTypes.style,
        labelStyle: Text.propTypes.style
    };

    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        required: false,
        onPress: null,
        containerStyle: null,
        contentContainerStyle: null
    };

    render() {
        const {onPress, required, label, value, containerStyle, contentContainerStyle, labelStyle} = this.props;

        let mappedContainerStyle = containerStyle ? containerStyle : styles.rowContainer;
        let mappedContentContainerStyle = contentContainerStyle ? contentContainerStyle : styles.rowInnerContainer;
        let mappedLabelStyle = labelStyle ? labelStyle : styles.leftText;

        return (
            <TouchableOpacity disabled={!onPress} style={mappedContainerStyle} onPress={onPress}>
                <View style={mappedContentContainerStyle}>
                    {required && !value &&
                    <Icon name='exclamation-circle' style={styles.requiredIcon}/>
                    }
                    <Text style={mappedLabelStyle}>{label}</Text>
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