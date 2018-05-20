import React, {Component} from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import {strings} from '../shared/i18n';
import ModalScreen from '../components/Modal';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 2;
const CONTAINER_HEIGHT = window.height / 4;
const CONTAINER_HEIGHT_SMALL = window.height / 8;
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

    onRegisterPress = () => {
        Keyboard.dismiss();
        const {username, password, confirmPassword, acceptedTermsOfService, acceptedPrivacyPolicy} = this.state;
        const termsOfService = Platform.OS === 'ios' ? strings('register.terms_of_service_ios') : strings('register.terms_of_service_android');
        const privacyPolicy = Platform.OS === 'ios' ? strings('register.privacy_policy_ios') : strings('register.privacy_policy_android');

        this.props.actions.register(username, password, confirmPassword, acceptedTermsOfService, termsOfService, acceptedPrivacyPolicy, privacyPolicy);
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
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <View style={styles.innerContainer}>
                    <View style={styles.loginFormContainer}>
                        <Animated.View style={[styles.topContainer, {height: this.state.containerHeight}]}>
                            <Animated.Image
                                style={[styles.image, {height: this.state.imageHeight}]}
                                source={require('../../assets/images/refundeo_logo.png')}
                            />
                        </Animated.View>
                        <View style={styles.inputContainer}>
                            <View style={[styles.elevatedInputContainer, styles.firstInput]}>
                                <Icon name='envelope' style={styles.icon}/>
                                <TextInput style={styles.usernameInput}
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
                                <TextInput style={styles.passwordInput}
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
                                <TextInput style={styles.passwordInput}
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
                                        tintColor={Platform.OS === 'ios' ? colors.activeTabColor : undefined}
                                        thumbTintColor={colors.activeTabColor}
                                        onValueChange={acceptedTermsOfService => this.setState({acceptedTermsOfService})}>
                                </Switch>
                                <View style={styles.eulaTextContainer}>
                                    <Text
                                        style={styles.eulaContainerText}>{strings('register.terms_of_service_1')}</Text>
                                    <TouchableOpacity style={styles.eulaButton}
                                                      onPress={this.openTermsOfServiceModal}
                                                      disabled={fetching}>
                                        <Text
                                            style={styles.eulaButtonText}>{strings('register.terms_of_service_2')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.eulaContainer}>
                                <Switch disabled={fetching}
                                        tintColor={Platform.OS === 'ios' ? colors.activeTabColor : undefined}
                                        thumbTintColor={colors.activeTabColor}
                                        value={this.state.acceptedPrivacyPolicy}
                                        onValueChange={acceptedPrivacyPolicy => this.setState({acceptedPrivacyPolicy})}>
                                </Switch>
                                <View style={styles.eulaTextContainer}>
                                    <Text style={styles.eulaContainerText}>{strings('register.privacy_policy_1')}</Text>
                                    <TouchableOpacity style={styles.eulaButton}
                                                      onPress={this.openPrivacyPolicyModal}
                                                      disabled={fetching}>
                                        <Text
                                            style={styles.eulaButtonText}>{strings('register.privacy_policy_2')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{registerError}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.registerButton}
                                                  onPress={this.onRegisterPress}
                                                  disabled={fetching}>
                                    <Text style={styles.buttonText}>{strings('register.register_button')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {fetching &&
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color={colors.activeTabColor} style={styles.activityIndicator}/>
                    </View>
                    }
                    <ModalScreen
                        modalTitle={strings('register.terms_of_service_title')}
                        noCancelButton={true}
                        onSubmit={this.closeTermsOfServiceModal}
                        onBack={this.closeTermsOfServiceModal}
                        contentContainerStyle={styles.eulaModalContainer}
                        onCancel={this.closeTermsOfServiceModal}
                        visible={this.props.state.navigation.modal['termsOfServiceModal'] || false}>
                        <ScrollView style={styles.eulaScrollContainer}>
                            <Text>{Platform.OS === 'ios' ? strings('register.terms_of_service_ios') : strings('register.terms_of_service_android')}</Text>
                        </ScrollView>
                    </ModalScreen>
                    <ModalScreen
                        modalTitle={strings('register.privacy_policy_title')}
                        noCancelButton={true}
                        onSubmit={this.closePrivacyPolicyModal}
                        onBack={this.closePrivacyPolicyModal}
                        contentContainerStyle={styles.eulaModalContainer}
                        onCancel={this.closePrivacyPolicyModal}
                        visible={this.props.state.navigation.modal['privacyPolicyModal'] || false}>
                        <ScrollView style={styles.eulaScrollContainer}>
                            <Text>{Platform.OS === 'ios' ? strings('register.privacy_policy_ios') : strings('register.privacy_policy_android')}</Text>
                        </ScrollView>
                    </ModalScreen>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    topContainer: {
        minHeight: IMAGE_HEIGHT_SMALL,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    loginFormContainer: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: '80%'
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    elevatedInputContainer: {
        backgroundColor: colors.whiteColor,
        borderRadius: 50,
        elevation: 5,
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
        color: colors.submitButtonColor
    },
    buttonContainer: {
        alignItems: 'stretch'
    },
    registerButton: {
        borderRadius: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        elevation: 5,
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
        color: colors.activeTabColor
    },
    activityIndicator: {
        elevation: 10
    },
    eulaContainer: {
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20
    },
    eulaModalContainer: {
        height: '100%',
        width: '100%'
    },
    eulaScrollContainer: {
        height: '70%'
    },
    eulaTextContainer: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eulaContainerText: {
        fontWeight: 'bold',
    },
    eulaButton: {
        marginLeft: 10,
        borderRadius: 2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.activeTabColor,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    eulaButtonText: {
        color: colors.submitButtonColor,
        fontWeight: 'bold'
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