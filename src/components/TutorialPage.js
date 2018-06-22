import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';

export default class TutorialPage extends PureComponent {

    static propTypes = {
        onIconPress: PropTypes.func,
        icon: PropTypes.element,
        contentColor: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        headlineColor: PropTypes.string,
        textColor: PropTypes.string,
        headline: PropTypes.string.isRequired
    };

    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        onIconPress: null,
    };

    render() {
        const {onIconPress, headlineColor, textColor, contentColor, text, headline, icon} = this.props;

        return (
            <View style={styles.container}>
                <View style={[styles.bottomContainer, {backgroundColor: contentColor}]}>
                    <Text style={[styles.headlineText, {color: headlineColor}]}>
                        {headline}
                    </Text>
                    <Text style={[styles.text,  {color: textColor}]}>
                        {text}
                    </Text>
                </View>
                {icon &&
                <TouchableOpacity disabled={!onIconPress} style={styles.logoButtonContainer} onPress={onIconPress}>
                    {icon}
                </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    logoButtonContainer: {
        justifyContent: 'center',
        position: 'absolute',
        top: 60,
        zIndex: 9999,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: colors.slightlyDarkerColor,
        borderColor: colors.inactiveTabColor,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderRadius: 200,
        elevation: 10,
        height: 115,
        width: 115
    },
    headlineText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        position: 'absolute',
        top: 80,
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        color: colors.whiteColor
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        width: '80%',
        position: 'absolute',
        top: 180,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        color: colors.slightlyDarkerColor
    },
    bottomContainer: {
        position: 'absolute',
        top: 120,
        paddingTop: 40,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.activeTabColor
    }
});