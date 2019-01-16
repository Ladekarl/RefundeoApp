import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import CustomText from './CustomText';

export default class TutorialPage extends PureComponent {

    static propTypes = {
        onIconPress: PropTypes.func,
        icon: PropTypes.element,
        contentColor: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        headlineColor: PropTypes.string,
        topColor: PropTypes.string,
        textColor: PropTypes.string,
        headline: PropTypes.string.isRequired
    };

    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        onIconPress: null,
    };

    render() {
        const {
            onIconPress,
            headlineColor,
            textColor,
            contentColor,
            topColor,
            text,
            headline,
            icon
        } = this.props;

        return (
            <View style={[styles.container, {backgroundColor: topColor}]}>
                {icon &&
                <View style={styles.topContainer}>
                    <View style={styles.outerContainer}>
                        <TouchableOpacity disabled={!onIconPress} style={styles.logoButtonContainer}
                                          onPress={onIconPress}>
                            {icon}
                        </TouchableOpacity>
                    </View>
                </View>
                }
                <View style={[styles.bottomContainer, {backgroundColor: contentColor}]}>
                    <View style={styles.topTextContainer}>
                        <CustomText style={[styles.headlineText, {color: headlineColor}]}>
                            {headline}
                        </CustomText>
                    </View>
                    <View style={styles.bottomTextContainer}>
                        <CustomText style={[styles.text, {color: textColor}]}>
                            {text}
                        </CustomText>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    outerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.addButtonOuterColor,
        borderRadius: 200
    },
    logoButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor,
        borderColor: colors.addButtonInnerColor,
        borderWidth: 4,
        borderRadius: 200,
        height: 120,
        width: 120
    },
    headlineText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.whiteColor
    },
    topTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    bottomTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 40,
        marginRight: 40,
        paddingBottom: 60,
        color: colors.slightlyDarkerColor
    },
    bottomContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.whiteColor
    }
});