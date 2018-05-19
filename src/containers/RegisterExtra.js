import React, {Component} from 'react';
import {ActivityIndicator, Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import SettingsScreen from './Settings';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {strings} from '../shared/i18n';

class RegisterExtraScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    onLoginPress = () => {
        const {
            firstName,
            lastName,
            country,
            bankAccountNumber,
            bankRegNumber,
        } = this.props.state.user;

        if (firstName && lastName && country && bankAccountNumber && bankRegNumber) {
            this.props.actions.navigateAndResetToMainFlow();
            this.props.actions.getRefundCases();
        } else {
            this.setState({error: strings('settings.error_password_not_filled')});
        }
    };


    render() {
        const {state, actions} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.topText}>{strings('register.more_information')}</Text>
                </View>
                <SettingsScreen
                    state={state}
                    noPassword={true}
                    actions={actions}
                />
                <Text style={styles.errorText}>{this.state.error}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.loginButton}
                                      onPress={this.onLoginPress}
                                      disabled={state.fetching}>
                        <Text style={styles.buttonText}>{strings('login.login_button')}</Text>
                    </TouchableOpacity>
                </View>
                {state.fetching &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.activeTabColor} style={styles.activityIndicator}/>
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    topContainer: {
        marginTop: 25,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.activeTabColor
    },
    buttonContainer: {
        alignItems: 'stretch',
        width: '80%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 35
    },
    loginButton: {
        borderRadius: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        elevation: 5,
        backgroundColor: colors.submitButtonColor
    },
    buttonText: {
        color: colors.whiteColor,
        fontSize: 12,
        fontWeight: 'bold'
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityIndicator: {
        elevation: 10
    },
    errorText: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        color: colors.cancelButtonColor
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
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
)(RegisterExtraScreen);