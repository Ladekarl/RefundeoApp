import React, {Component} from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
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

const window = Dimensions.get('window');
const IMAGE_HEIGHT = 100;
const CONTAINER_HEIGHT = window.height / 2;
const CONTAINER_HEIGHT_SMALL = 150;
const IMAGE_HEIGHT_SMALL = 100;

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

    render() {
        const {fetching, loginError} = this.props.state;
        return (
            <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
                                  behavior='padding'>
                <View style={styles.innerContainer}>
                    <View style={styles.loginFormContainer}>
                        <Animated.View style={[styles.topContainer, {height: this.state.containerHeight}]}>
                            <Animated.Image
                                style={[styles.image, {height: this.state.imageHeight}]}
                                source={require('../../assets/refundeo_logo.png')}
                            />
                        </Animated.View>
                        <View style={styles.inputContainer}>
                            <View style={[styles.elevatedInputContainer, styles.firstInput]}>
                                <Icon name={'envelope'} style={styles.icon}/>
                                <TextInput style={styles.usernameInput}
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
                                <TextInput style={styles.passwordInput}
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
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{loginError}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.loginButton}
                                                  onPress={this.onLoginPress}
                                                  disabled={fetching}>
                                    <Text style={styles.buttonText}>{strings('login.login_button')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
        flex: 1,
        paddingBottom: '10%'
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