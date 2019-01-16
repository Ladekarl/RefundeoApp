import React, {PureComponent} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewPropTypes,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import CustomText from './CustomText';

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
                <View style={styles.innerContainer}>
                    <View style={[styles.rowInnerContainer, contentContainerStyle]}>
                        {required && !value &&
                        <Icon name='exclamation-circle' style={styles.requiredIcon}/>
                        }
                        <CustomText style={[styles.leftText, labelStyle]}>{label}</CustomText>
                    </View>
                    {value &&
                    <CustomText style={styles.rightText}>{value}</CustomText>
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        //borderWidth: 2,
        borderColor: colors.addButtonOuterColor,
        borderRadius: 12,
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //borderWidth: 2,
        borderColor: colors.addButtonInnerColor,
        borderRadius: 10,
        padding: 15,
    },
    rowInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    requiredIcon: {
        fontSize: 15,
        height: undefined,
        width: undefined,
        color: colors.cancelButtonColor
    },
    leftText: {
        marginLeft: 10,
        color: colors.inactiveTabColor
    },
    rightText: {
        marginRight: 10,
        color: colors.whiteColor
    }
});