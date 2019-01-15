import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Platform, Image} from 'react-native';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import {strings} from '../shared/i18n';
import CustomText from '../components/CustomText';

class QRCode extends Component {

    static propTypes = {
        state: PropTypes.object.isRequired
    };

    static navigationOptions = {
        tabBarIcon: ({tintColor}) => {
            let newTintColor = tintColor === colors.activeTabColor ? colors.activeTabColor : colors.backgroundColor;
            if (Platform.OS === 'ios') {
                return (
                    <View style={styles.tabBarContainerIOs}>
                        <CustomText
                            style={[styles.tabBarIconIOs, {color: newTintColor}]}>{strings('qr_code.id')}</CustomText>
                    </View>
                );
            } else {
                return (
                    <CustomText
                        style={[styles.tabBarIconAndroid, {color: tintColor}]}>{strings('qr_code.id')}</CustomText>
                );
            }
        }
    };

    render() {
        const {user} = this.props.state;
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <CustomText style={styles.topText}>{strings('qr_code.my_id')}</CustomText>
                </View>
                <View style={styles.outerContainer}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.qrCode} source={{uri: 'data:image/png;base64,' + user.qrCode}}/>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <CustomText style={styles.bottomText}>{strings('qr_code.show_this')}</CustomText>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomContainer: {
        width: '70%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 35,
        color: colors.whiteColor
    },
    bottomText: {
        textAlign: 'center',
        fontSize: 20,
        color: colors.inactiveTabColor
    },
    tabBarContainerIOs: {
        height: 70,
        width: 70,
        borderRadius: 100,
        backgroundColor: colors.whiteColor,
        borderWidth: 4,
        borderColor: colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarIconIOs: {
        fontSize: 30,
        alignSelf: 'center',
        textAlign: 'center',
        marginLeft: 1,
        fontWeight: 'bold'
    },
    tabBarIconAndroid: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    outerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.addButtonOuterColor,
        borderWidth: 4,
        borderRadius: 200
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.addButtonInnerColor,
        borderWidth: 4,
        borderRadius: 200,
        backgroundColor: colors.completelyWhite,
        padding: 42
    },
    qrCode: {
        height: 200,
        width: 200
    }
});

const mapStateToProps = state => {
    return {
        state: {
            ...state.authReducer
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QRCode);