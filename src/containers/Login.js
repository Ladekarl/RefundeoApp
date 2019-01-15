import React, {Component} from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import {strings} from '../shared/i18n';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import CustomText from '../components/CustomText';
import CustomTextInput from '../components/CustomTextInput';
import ModalScreen from '../components/Modal';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 3;
const CONTAINER_HEIGHT = window.height / 2;
const CONTAINER_HEIGHT_SMALL = 0;
const IMAGE_HEIGHT_SMALL = 0;

class LoginScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        title: strings('login.login'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    secondInput;

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            username: '',
            password: '',
            imageHeight: new Animated.Value(IMAGE_HEIGHT),
            containerHeight: new Animated.Value(CONTAINER_HEIGHT)
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
        const isForgotPasswordModalOpen = this.props.state.navigation.modal['forgotPasswordModal'];
        if (!isForgotPasswordModalOpen) {
            this._animate(CONTAINER_HEIGHT_SMALL, IMAGE_HEIGHT_SMALL);
        }
    };

    _keyboardWillHide = () => {
        const isForgotPasswordModalOpen = this.props.state.navigation.modal['forgotPasswordModal'];
        if (!isForgotPasswordModalOpen) {
            this._animate(CONTAINER_HEIGHT, IMAGE_HEIGHT);
        }
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

    onLoginPress = () => {
        Keyboard.dismiss();
        const {username, password} = this.state;
        this._login(username.trim(), password);
    };

    onForgotPassword = () => {
        Keyboard.dismiss();
        this.openForgotPasswordModal();
    };

    _login = (username, password) => {
        this.props.actions.login(username, password);
    };

    closeForgotPasswordModal = () => {
        this.props.actions.closeModal('forgotPasswordModal');
    };

    openForgotPasswordModal = () => {
        this.props.actions.openModal('forgotPasswordModal');
    };

    onForgotPasswordModalSuccess = () => {
        const username = this.state.username;
        const forgotPasswordEmail = this.props.state.forgotPasswordEmail;
        if (forgotPasswordEmail) {
            this.closeForgotPasswordModal();
        }
        if (username) {
            this.props.actions.forgotPassword(username);
        }
    };

    render() {
        const {fetching, loginError, navigation, forgotPasswordError, forgotPasswordEmail} = this.props.state;

        return (
            <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
                                  behavior='padding'>
                <View style={styles.innerContainer}>
                    <View style={styles.loginFormContainer}>
                        <Animated.View style={[styles.topContainer, {height: this.state.containerHeight}]}>
                            <Animated.Image
                                style={[styles.image, {height: this.state.imageHeight}]}
                                source={require('../../assets/refundeo_banner_top_small.png')}
                            />
                        </Animated.View>
                        <View style={styles.inputContainer}>
                            <View style={[styles.elevatedInputContainer, styles.firstInput]}>
                                <Icon name={'envelope'} style={styles.icon}/>
                                <CustomTextInput style={styles.usernameInput}
                                                 ref={(input) => this.firstInput = input}
                                                 placeholder={strings('login.email_placeholder')}
                                                 autoCapitalize='none'
                                                 textAlignVertical='center'
                                                 editable={!fetching}
                                                 returnKeyType='next'
                                                 keyboardType={'email-address'}
                                                 underlineColorAndroid='transparent'
                                                 selectionColor={colors.activeTabColor}
                                                 onSubmitEditing={() => this.secondInput.focus()}
                                                 value={this.state.username}
                                                 onChangeText={username => this.setState({username})}/>
                            </View>
                            <View style={styles.elevatedInputContainer}>
                                <Icon name={'lock'} style={[styles.icon, styles.secondIcon]}/>
                                <CustomTextInput style={styles.passwordInput}
                                                 ref={(input) => this.secondInput = input}
                                                 secureTextEntry={true}
                                                 textAlignVertical='center'
                                                 editable={!fetching}
                                                 returnKeyType='done'
                                                 autoCapitalize='none'
                                                 underlineColorAndroid='transparent'
                                                 selectionColor={colors.activeTabColor}
                                                 placeholder={strings('login.password_placeholder')}
                                                 value={this.state.password}
                                                 onChangeText={password => this.setState({password})}/>
                            </View>
                            <View style={styles.forgotPasswordContainer}>
                                <TouchableOpacity style={styles.forgotPasswordButton}
                                                  onPress={this.onForgotPassword}
                                                  disabled={fetching}>
                                    <CustomText
                                        style={styles.forgotPasswordText}>{strings('login.forgot_password')}</CustomText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.loginButton}
                                                  onPress={this.onLoginPress}
                                                  disabled={fetching}>
                                    <CustomText style={styles.buttonText}>{strings('login.login_button')}</CustomText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.errorContainer}>
                                <CustomText style={styles.errorText}>{loginError}</CustomText>
                            </View>
                        </View>
                    </View>
                    <ModalScreen
                        modalTitle={strings('login.forgot_password_modal')}
                        onBack={this.closeForgotPasswordModal}
                        onCancel={this.closeForgotPasswordModal}
                        fetching={fetching}
                        onSubmit={this.onForgotPasswordModalSuccess}
                        visible={navigation.modal['forgotPasswordModal'] || false}>
                        <View style={styles.modalContainer}>
                            {!forgotPasswordEmail &&
                            <CustomText
                                style={styles.headlineText}>{strings('login.forgot_password_modal_text')}</CustomText>
                            }
                            {!forgotPasswordEmail &&
                            <CustomTextInput style={styles.forgotPasswordInput}
                                             textAlignVertical='center'
                                             editable={!fetching}
                                             returnKeyType='done'
                                             autoCapitalize='none'
                                             selectionColor={colors.activeTabColor}
                                             placeholder={strings('login.email_placeholder')}
                                             value={this.state.username}
                                             onChangeText={username => this.setState({username})}/>
                            }
                            {!!forgotPasswordEmail &&
                            <View style={styles.forgotPasswordModalContainer}>
                                <CustomText
                                    style={styles.forgotPasswordEmailText}>{strings('login.password_reset_link') + ' ' + forgotPasswordEmail}</CustomText>
                            </View>
                            }
                            {!!forgotPasswordError &&
                            <View style={styles.forgotPasswordModalContainer}>
                                <CustomText style={styles.errorText}>{forgotPasswordError}</CustomText>
                            </View>
                            }
                        </View>
                    </ModalScreen>
                    {fetching &&
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color={colors.activeTabColor} style={styles.activityIndicator}/>
                    </View>
                    }
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
        flex: 1
    },
    loginFormContainer: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: '80%',
        flex: 1
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    elevatedInputContainer: {
        backgroundColor: colors.whiteColor,
        borderRadius: 10,
        elevation: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.activeTabColor
    },
    firstInput: {
        marginBottom: 20
    },
    secondIcon: {
        marginLeft: 10,
        marginRight: 6
    },
    forgotPasswordContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotPasswordButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotPasswordText: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        color: colors.activeTabColor
    },
    forgotPasswordModalContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorContainer: {
        height: 80,
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
    modalContainer: {
        paddingTop: 20,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    forgotPasswordInput: {
        fontSize: 16,
        height: 40,
        width: '80%',
        padding: 5,
        marginTop: 1,
        marginBottom: 1,
        textAlign: 'center'
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
    forgotPasswordEmailText: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold'
    },
    buttonContainer: {
        alignItems: 'stretch'
    },
    loginButton: {
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        elevation: 5,
        backgroundColor: colors.activeTabColor
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
    activityIndicator: {
        elevation: 10
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
)(LoginScreen);