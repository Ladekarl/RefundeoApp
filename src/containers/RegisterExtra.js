import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import SettingsScreen from './Settings';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {strings} from '../shared/i18n';
import Validation from '../shared/Validation';
import CustomText from '../components/CustomText';

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
            user
        } = this.props.state;

        if (!Validation.missingUserInfo(user)) {
            this.props.actions.navigateAndResetToMainFlow();
            this.props.actions.getRefundCases();
            return;
        }
        if (!user.acceptedTermsOfService) {
            this.setState({error: strings('register.accept_terms_of_service')});
        }
        if (!user.acceptedPrivacyPolicy) {
            this.setState({error: strings('register.accept_privacy_policy')});
        }
        this.setState({error: strings('register.required_fields')});
    };

    render() {
        const {state, actions} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <CustomText style={styles.topText}>{strings('register.more_information')}</CustomText>
                </View>
                <View style={styles.settingsContainer}>
                    {!!state.user.id &&
                    <SettingsScreen
                        state={state}
                        requiredOnly={true}
                        actions={actions}
                    />
                    }
                </View>
                <CustomText style={styles.errorText}>{this.state.error}</CustomText>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.loginButton}
                                      onPress={this.onLoginPress}
                                      disabled={state.fetching}>
                        <CustomText style={styles.buttonText}>{strings('login.login_button')}</CustomText>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: colors.submitButtonColor
    },
    settingsContainer: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth
    },
    buttonText: {
        color: colors.whiteColor,
        fontSize: 12,
        fontWeight: 'bold'
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