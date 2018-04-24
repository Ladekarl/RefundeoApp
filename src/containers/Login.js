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
const CONTAINER_HEIGHT = window.height / 2;
const CONTAINER_HEIGHT_SMALL = window.height / 6;
const IMAGE_HEIGHT_SMALL = 0;

class LoginScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        header: null,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
            imageHeight: new Animated.Value(IMAGE_HEIGHT),
            containerHeight: new Animated.Value(CONTAINER_HEIGHT),
            eulaDialogVisible: false
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

    onLoginPress = () => {
        Keyboard.dismiss();
        const {username, password} = this.state;
        this._login(username.trim(), password);
    };

    _login = (username, password) => {
        this.props.actions.login(username, password);
    };

    _renderIos = () => {
        return (
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                {this._renderShared()}
            </KeyboardAvoidingView>
        );
    };

    _renderAndroid = () => {
        return (
            <View style={styles.container}>
                {this._renderShared()}
            </View>
        );
    };

    showEulaDialog = (visible) => {
        // noinspection JSAccessibilityCheck
        this.setState({eulaDialogVisible: visible});
    };

    _renderShared = () => {
        const {state} = this.props;
        // noinspection JSAccessibilityCheck
        return (
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
                            <Icon name={'user'} style={styles.icon}/>
                            <TextInput style={styles.usernameInput}
                                       placeholder={strings('login.email_placeholder')}
                                       autoCapitalize='none'
                                       textAlignVertical={'center'}
                                       editable={!state.fetching}
                                       underlineColorAndroid='transparent'
                                       selectionColor={colors.inactiveTabColor}
                                       value={this.state.username}
                                       onChangeText={username => this.setState({username})}/>
                        </View>
                        <View style={styles.elevatedInputContainer}>
                            <Icon name={'lock'} style={styles.icon}/>
                            <TextInput style={styles.passwordInput}
                                       secureTextEntry={true}
                                       textAlignVertical={'center'}
                                       editable={!state.fetching}
                                       autoCapitalize='none'
                                       underlineColorAndroid='transparent'
                                       selectionColor={colors.inactiveTabColor}
                                       placeholder={strings('login.password_placeholder')}
                                       value={this.state.password}
                                       onChangeText={password => this.setState({password})}/>
                        </View>
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{this.props.state.error}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.loginButton}
                                              onPress={this.onLoginPress}
                                              disabled={state.fetching}>
                                <Text style={styles.loginButtonText}>{strings('login.login_button')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.eulaContainer}>
                            <Text style={styles.eulaText}>
                                {strings('login.eula_agreement_1')}
                                <Text
                                    onPress={() => this.showEulaDialog(true)}
                                    style={styles.eulaLink}>
                                    {strings('login.eula_agreement_2')}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
                {state.fetching &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.inactiveTabColor} style={styles.activityIndicator}/>
                </View>
                }
                <ModalScreen
                    modalTitle={strings('login.eula_title')}
                    noCancelButton={true}
                    onSubmit={() => this.showEulaDialog(false)}
                    onBack={() => this.showEulaDialog(false)}
                    visible={this.state.eulaDialogVisible}>
                    <ScrollView style={styles.eulaTextContainer}>
                        <Text>{Platform.OS === 'ios' ? strings('login.eula_ios') : strings('login.eula_android')}</Text>
                    </ScrollView>
                </ModalScreen>
            </View>
        );
    };

    render() {
        if (Platform.OS === 'ios') {
            return this._renderIos();
        } else {
            return this._renderAndroid();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topContainer: {
        minHeight: IMAGE_HEIGHT_SMALL,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginFormContainer: {
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '80%'
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'stretch',
        marginBottom: 20
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
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.inactiveTabColor,
    },
    firstInput: {
        marginBottom: 20
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
    eulaContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    eulaTextContainer: {
        height: '70%',
    },
    eulaText: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
    },
    eulaLink: {
        color: colors.linkColor,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        textDecorationLine: 'underline'
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
        color: colors.errorColor
    },
    buttonContainer: {
        alignItems: 'stretch'
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
    loginButtonText: {
        color: colors.whiteColor
    },
    icon: {
        fontSize: 20,
        marginLeft: 5,
        marginRight: 5,
        color: colors.inactiveTabColor
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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScreen);