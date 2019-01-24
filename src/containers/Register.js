import React, {Component} from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform, ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
    WebView
} from 'react-native';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import {strings} from '../shared/i18n';
import ModalScreen from '../components/Modal';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Helpers from '../api/Helpers';
import CustomText from '../components/CustomText';
import CustomTextInput from '../components/CustomTextInput';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 3;
const CONTAINER_HEIGHT = window.height / 4;
const CONTAINER_HEIGHT_SMALL = 10;
const IMAGE_HEIGHT_SMALL = 0;

class RegisterScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        title: strings('register.register'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    firstInput;
    secondInput;
    thirdInput;

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            imageHeight: new Animated.Value(IMAGE_HEIGHT),
            containerHeight: new Animated.Value(CONTAINER_HEIGHT),
            acceptedTermsOfService: false,
            acceptedPrivacyPolicy: false
        };
    }

    componentDidMount() {
        this.keyboardWillShowSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', this._keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', this._keyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    _keyboardWillShow = () => {
        this._animate(CONTAINER_HEIGHT_SMALL, IMAGE_HEIGHT_SMALL);
    };

    _keyboardWillHide = () => {
        this._animate(CONTAINER_HEIGHT, IMAGE_HEIGHT);
    };

    _animate(containerHeight, imageHeight) {
        const friction = 20;
        const tension = 220;
        Animated.parallel([
            Animated.spring(this.state.containerHeight, {
                friction,
                tension,
                toValue: containerHeight
            }),
            Animated.spring(this.state.imageHeight, {
                friction,
                tension: tension / 1.5,
                toValue: imageHeight
            })
        ]).start();
    }

    termsOfServiceVersion = Helpers.termsOfServiceVersion;
    privacyPolicyVersion = Helpers.privacyPolicyVersion;

    onRegisterPress = () => {
        Keyboard.dismiss();
        const {username, password, confirmPassword, acceptedTermsOfService, acceptedPrivacyPolicy} = this.state;

        this.props.actions.register(username, password, username, confirmPassword, acceptedTermsOfService, this.termsOfServiceVersion, acceptedPrivacyPolicy, this.privacyPolicyVersion);
    };

    closeTermsOfServiceModal = () => {
        return this.props.actions.closeModal('termsOfServiceModal');
    };

    openTermsOfServiceModal = () => {
        return this.props.actions.openModal('termsOfServiceModal');
    };

    closePrivacyPolicyModal = () => {
        return this.props.actions.closeModal('privacyPolicyModal');
    };

    openPrivacyPolicyModal = () => {
        return this.props.actions.openModal('privacyPolicyModal');
    };

    render() {
        const {fetching, registerError} = this.props.state;
        return (
            <ScrollView style={styles.innerContainer} contentContainerStyle={styles.innerContentContainer}>
                <KeyboardAvoidingView style={styles.container} behavior='padding'>
                    <View style={styles.loginFormContainer}>
                        <Animated.View style={[styles.topContainer, {height: this.state.containerHeight}]}>
                            <Animated.Image
                                style={[styles.image, {height: this.state.imageHeight}]}
                                source={require('../../assets/refundeo_banner_top_small.png')}
                            />
                        </Animated.View>
                        <View style={styles.inputContainer}>
                            <View style={[styles.elevatedInputContainer, styles.firstInput]}>
                                <Icon name='envelope' style={styles.icon}/>
                                <CustomTextInput style={styles.usernameInput}
                                                 ref={(input) => this.firstInput = input}
                                                 placeholder={strings('login.email_placeholder')}
                                                 autoCapitalize='none'
                                                 textAlignVertical='center'
                                                 editable={!fetching}
                                                 returnKeyType='next'
                                                 keyboardType={'email-address'}
                                                 underlineColorAndroid='transparent'
                                                 autoCorrect={false}
                                                 selectionColor={colors.activeTabColor}
                                                 onSubmitEditing={() => this.secondInput.focus()}
                                                 value={this.state.username}
                                                 onChangeText={username => this.setState({username})}/>
                            </View>
                            <View style={styles.elevatedInputContainer}>
                                <Icon name='lock' style={[styles.icon, styles.secondIcon]}/>
                                <CustomTextInput style={styles.passwordInput}
                                                 ref={(input) => this.secondInput = input}
                                                 secureTextEntry={true}
                                                 textAlignVertical='center'
                                                 editable={!fetching}
                                                 returnKeyType='next'
                                                 autoCapitalize='none'
                                                 underlineColorAndroid='transparent'
                                                 autoCorrect={false}
                                                 selectionColor={colors.activeTabColor}
                                                 onSubmitEditing={() => this.thirdInput.focus()}
                                                 placeholder={strings('login.password_placeholder')}
                                                 value={this.state.password}
                                                 onChangeText={password => this.setState({password})}/>
                            </View>
                            <View style={[styles.elevatedInputContainer, styles.thirdInput]}>
                                <Icon name='lock' style={[styles.icon, styles.secondIcon]}/>
                                <CustomTextInput style={styles.passwordInput}
                                                 ref={(input) => this.thirdInput = input}
                                                 secureTextEntry={true}
                                                 textAlignVertical='center'
                                                 editable={!fetching}
                                                 returnKeyType='done'
                                                 autoCapitalize='none'
                                                 underlineColorAndroid='transparent'
                                                 autoCorrect={false}
                                                 selectionColor={colors.activeTabColor}
                                                 placeholder={strings('register.confirm_password_placeholder')}
                                                 value={this.state.confirmPassword}
                                                 onChangeText={confirmPassword => this.setState({confirmPassword})}/>
                            </View>
                            <View style={styles.eulaContainer}>
                                <Switch disabled={fetching}
                                        value={this.state.acceptedTermsOfService}
                                        trackColor={colors.activeTabColor}
                                        thumbColor={colors.activeTabColor}
                                        tintColor={colors.darkTextColor}
                                        onValueChange={acceptedTermsOfService => this.setState({acceptedTermsOfService})}>
                                </Switch>
                                <View style={styles.eulaTextContainer}>
                                    <CustomText
                                        style={styles.eulaContainerText}>{strings('register.terms_of_service_1')}</CustomText>
                                    <TouchableOpacity style={styles.eulaButton}
                                                      onPress={this.openTermsOfServiceModal}
                                                      disabled={fetching}>
                                        <CustomText
                                            style={styles.eulaButtonText}>{strings('register.terms_of_service_2')}</CustomText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.eulaContainer}>
                                <Switch disabled={fetching}
                                        trackColor={colors.activeTabColor}
                                        thumbColor={colors.activeTabColor}
                                        tintColor={colors.darkTextColor}
                                        value={this.state.acceptedPrivacyPolicy}
                                        onValueChange={acceptedPrivacyPolicy => this.setState({acceptedPrivacyPolicy})}>
                                </Switch>
                                <View style={styles.eulaTextContainer}>
                                    <CustomText
                                        style={styles.eulaContainerText}>{strings('register.privacy_policy_1')}</CustomText>
                                    <TouchableOpacity style={styles.eulaButton}
                                                      onPress={this.openPrivacyPolicyModal}
                                                      disabled={fetching}>
                                        <CustomText
                                            style={styles.eulaButtonText}>{strings('register.privacy_policy_2')}</CustomText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.errorContainer}>
                                <CustomText style={styles.errorText}>{registerError}</CustomText>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.registerButton}
                                                  onPress={this.onRegisterPress}
                                                  disabled={fetching}>
                                    <CustomText
                                        style={styles.buttonText}>{strings('register.register_button')}</CustomText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {fetching &&
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color={colors.activeTabColor}/>
                    </View>
                    }
                    <ModalScreen
                        modalTitle={strings('register.terms_of_service_title')}
                        noCancelButton={true}
                        onSubmit={this.closeTermsOfServiceModal}
                        onBack={this.closeTermsOfServiceModal}
                        onCancel={this.closeTermsOfServiceModal}
                        contentContainerStyle={styles.policyContainer}
                        fullScreen={true}
                        visible={this.props.state.navigation.modal['termsOfServiceModal'] || false}>
                        <View style={styles.policyContainer}>
                            <WebView style={styles.policyContainer}
                                     originWhitelist={['*']}
                                     source={{html: strings('register.terms_of_service')}}/>
                        </View>
                    </ModalScreen>
                    <ModalScreen
                        modalTitle={strings('register.privacy_policy_title')}
                        noCancelButton={true}
                        onSubmit={this.closePrivacyPolicyModal}
                        onBack={this.closePrivacyPolicyModal}
                        onCancel={this.closePrivacyPolicyModal}
                        contentContainerStyle={styles.policyContainer}
                        fullScreen={true}
                        visible={this.props.state.navigation.modal['privacyPolicyModal'] || false}>
                        <View style={styles.policyContainer}>
                            <WebView originWhitelist={['*']} style={styles.policyContainer}
                                     source={{html: strings('register.privacy_policy')}}/>
                        </View>
                    </ModalScreen>
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor
    },
    policyContainer: {
        flex: 1,
        backgroundColor: colors.transparent
    },
    innerContainer: {
        backgroundColor: colors.backgroundColor,
    },
    innerContentContainer: {
        alignItems: 'center',
        backgroundColor: colors.backgroundColor,
    },
    topContainer: {
        minHeight: IMAGE_HEIGHT_SMALL,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'stretch',
        flex: 1
    },
    loginFormContainer: {
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flex: 1,
        paddingBottom: '5%'
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    elevatedInputContainer: {
        backgroundColor: colors.whiteColor,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.activeTabColor,
    },
    firstInput: {
        marginBottom: 20
    },
    thirdInput: {
        marginTop: 20,
        marginBottom: 20
    },
    secondIcon: {
        marginLeft: 10,
        marginRight: 6
    },
    errorContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
    image: {
        height: IMAGE_HEIGHT,
        minHeight: IMAGE_HEIGHT_SMALL,
        resizeMode: 'contain'
    },
    usernameInput: {
        flex: 1,
        fontSize: 16,
        height: 40,
        padding: 5,
        marginTop: 1,
        marginBottom: 1
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        height: 40,
        padding: 5,
        marginTop: 1,
        marginBottom: 1
    },
    errorText: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        color: colors.activeTabColor
    },
    buttonContainer: {
        alignItems: 'stretch'
    },
    registerButton: {
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        backgroundColor: colors.greenButtonColor
    },
    buttonText: {
        color: colors.whiteColor,
        fontSize: 12,
        fontWeight: 'bold'
    },
    icon: {
        fontSize: 20,
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginRight: 5,
        color: colors.darkTextColor
    },
    eulaContainer: {
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20
    },
    eulaTextContainer: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eulaContainerText: {
        fontWeight: 'bold',
        color: colors.inactiveTabColor
    },
    eulaButton: {
        marginLeft: 10,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.activeTabColor,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor
    },
    eulaButtonText: {
        color: colors.whiteColor,
        fontWeight: 'bold',
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
)(RegisterScreen);