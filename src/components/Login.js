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
import {NavigationActions} from 'react-navigation'
import LocalStorage from '../storage/LocalStorage';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import {strings} from '../shared/i18n';
import ModalScreen from './Modal';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 2;
const CONTAINER_HEIGHT = window.height / 2;
const CONTAINER_HEIGHT_SMALL = window.height / 6;
const IMAGE_HEIGHT_SMALL = window.width / 6;

export default class LoginScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false,
            imageHeight: new Animated.Value(IMAGE_HEIGHT),
            containerHeight: new Animated.Value(CONTAINER_HEIGHT),
            eulaDialogVisible: false
        };

        // TODO Get current user
        const user = null;
        if (user) {
            this._navigateAndReset('mainFlow');
        }

        this.keyboardWillShowSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    componentDidMount() {
        LocalStorage.getUser().then(user => {
            if (user && user.email && user.password) {
                this.setState({email: user.email, password: user.password});
                this._login(user.email, user.password)
            }
        }).catch(error => {
            this.setState({error: error.message})
        });
    }

    keyboardWillShow = (event) => {
        if (!event || !event.duration) {
            event = {duration: 1};
        }
        Animated.parallel([
            Animated.timing(this.state.containerHeight, {
                duration: event.duration,
                toValue: CONTAINER_HEIGHT_SMALL
            }),
            Animated.timing(this.state.imageHeight, {
                duration: event.duration,
                toValue: IMAGE_HEIGHT_SMALL
            })
        ]).start();
    };

    keyboardWillHide = (event) => {
        if (!event || !event.duration) {
            event = {duration: 1};
        }
        Animated.parallel([
            Animated.timing(this.state.containerHeight, {
                duration: event.duration,
                toValue: CONTAINER_HEIGHT,
            }),
            Animated.timing(this.state.imageHeight, {
                duration: event.duration,
                toValue: IMAGE_HEIGHT,
            })
        ]).start();
    };

    onLoginPress = () => {
        Keyboard.dismiss();
        const {email, password} = this.state;
        this._login(email.trim(), password);
    };

    _login = (email, password) => {
        this.setState({error: '', loading: true});
        // TODO Sign in with email and password then
        // firebase.auth().signInWithEmailAndPassword(email, password)
        //     .then((user) => {
        //         Database.getUser(user.uid).then(snapshot => {
        //          const dbUser = snapshot.val();
        const user = {};
        if (!user) {
            this._stopLoadingAndSetError(strings('login.error_user_does_not_exist_in_database'));
            return;
        }
        this._saveUserAndNavigate(user);
        //         }).catch(error => {
        //             this._stopLoadingAndSetError(error)
        //         });
        //     }).catch(error => {
        //     this._stopLoadingAndSetError(error)
        // });
    };

    _saveUserAndNavigate = (user) => {
        LocalStorage.setUser(user).then(() => {
            this.setState({error: '', loading: false});
            this._navigateAndReset('mainFlow');
        }).catch(error => {
            this._stopLoadingAndSetError(error);
        });
    };

    _stopLoadingAndSetError = (error) => {
        this.setState({error: error.message, loading: false});
    };

    _navigateAndReset = (routeName) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: routeName})],
        });
        this.props.navigation.dispatch(resetAction);
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
        this.setState({eulaDialogVisible: visible});
    };

    _renderShared = () => {
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
                        <View style={[styles.elevatedInputContainer, {marginBottom: 20}]}>
                            <Icon name={'user'} style={styles.icon}/>
                            <TextInput style={styles.usernameInput}
                                       placeholder={strings('login.email_placeholder')}
                                       keyboardType='email-address'
                                       autoCapitalize='none'
                                       textAlignVertical={'center'}
                                       editable={!this.state.loading}
                                       underlineColorAndroid='transparent'
                                       selectionColor={colors.inactiveTabColor}
                                       value={this.state.email}
                                       onChangeText={email => this.setState({email})}/>
                        </View>
                        <View style={styles.elevatedInputContainer}>
                            <Icon name={'lock'} style={styles.icon}/>
                            <TextInput style={styles.passwordInput}
                                       secureTextEntry={true}
                                       textAlignVertical={'center'}
                                       editable={!this.state.loading}
                                       autoCapitalize='none'
                                       underlineColorAndroid='transparent'
                                       selectionColor={colors.inactiveTabColor}
                                       placeholder={strings('login.password_placeholder')}
                                       value={this.state.password}
                                       onChangeText={password => this.setState({password})}/>
                        </View>
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{this.state.error}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.loginButton}
                                              onPress={this.onLoginPress}
                                              disabled={this.state.loading}>
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
                {this.state.loading &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.inactiveTabColor} style={{elevation: 10}}/>
                </View>
                }
                <ModalScreen
                    modalTitle={strings('login.eula_title')}
                    noCancelButton={true}
                    onSubmit={() => this.showEulaDialog(false)}
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
        color: 'blue',
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
    }
});