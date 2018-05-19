import React, {Component} from 'react';
import {ActivityIndicator, Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import LocalStorage from '../storage';
import {strings} from '../shared/i18n';
import {AccessToken, LoginManager} from 'react-native-fbsdk';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 2;
const CONTAINER_HEIGHT = window.height / 2;
const CONTAINER_HEIGHT_SMALL = window.height / 6;
const IMAGE_HEIGHT_SMALL = window.width / 3;

class InitialScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        header: null
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            imageHeight: new Animated.Value(IMAGE_HEIGHT),
            containerHeight: new Animated.Value(CONTAINER_HEIGHT),
            bottomContainerHeight: new Animated.Value(CONTAINER_HEIGHT_SMALL),
            shouldShowLogin: false,
            offsetY: new Animated.Value(CONTAINER_HEIGHT)
        };
    }

    componentDidMount() {
        this._shouldNavigate().then(shouldNavigate => {
            if (shouldNavigate) {
                this.props.actions.navigateInitial();
            } else {
                this.setState({shouldShowLogin: true});
                this._animate(CONTAINER_HEIGHT_SMALL, IMAGE_HEIGHT_SMALL);
            }
        }).catch(() => {
            this.setState({shouldShowLogin: true});
            this._animate(CONTAINER_HEIGHT_SMALL, IMAGE_HEIGHT_SMALL);
        });
    }

    _shouldNavigate = async () => {
        const user = await LocalStorage.getUser();
        return user && user.token;
    };

    _animate = (containerHeight, imageHeight) => {
        const friction = 40;
        const tension = 110;
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
            }),
            Animated.spring(this.state.offsetY, {
                friction,
                tension: tension / 1.5,
                toValue: imageHeight
            })
        ]).start();
    };

    loginFacebook = () => {
        LoginManager.logInWithReadPermissions(['email', 'user_birthday', 'user_location']).then(
            result => {
                if (result.isCancelled) {
                    this.props.actions.facebookLoginError(strings('login.unknown_error'));
                }
                else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                        this.props.actions.loginFacebook(data.accessToken.toString());
                    }).catch(() => {
                        this.props.actions.facebookLoginError(strings('login.unknown_error'));
                    });
                }
            },
            () => {
                this.props.actions.facebookLoginError(strings('login.unknown_error'));
            }
        );
    };

    render() {
        const {fetching, facebookLoginError} = this.props.state;
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.topContainer, {height: this.state.containerHeight}]}>
                    <Animated.Image
                        style={[styles.image, {height: this.state.imageHeight}]}
                        source={require('../../assets/images/refundeo_logo.png')}
                    />
                </Animated.View>
                {this.state.shouldShowLogin &&
                <Animated.View style={[styles.bottomContainer, {
                    height: this.state.bottomContainerHeight,
                    marginTop: this.state.offsetY
                }]}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{facebookLoginError}</Text>
                    </View>
                    <TouchableOpacity style={styles.facebookButton}
                                      onPress={this.loginFacebook}
                                      disabled={fetching}>
                        <View style={styles.facebookIconContainer}>
                            <Image style={styles.facebookIcon}
                                   source={require('../../assets/images/facebook-icon.png')}/>
                        </View>
                        <Text style={styles.buttonText}>{strings('register.facebook_button')}</Text>
                        <View style={styles.facebookAligner}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signUpButton}
                                      onPress={this.props.actions.navigateRegister}
                                      disabled={fetching}>
                        <Text style={styles.buttonText}>{strings('register.register_button')}</Text>
                    </TouchableOpacity>
                    <View style={styles.alreadyCustomerContainer}>
                        <Text style={styles.alreadyCustomerText}>{strings('login.already_have_account')}</Text>
                        <TouchableOpacity style={styles.loginButton}
                                          onPress={this.props.actions.navigateLogIn}
                                          disabled={fetching}>
                            <Text style={styles.loginButtonText}>{strings('login.login_button')}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                }
                {fetching &&
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
        justifyContent: 'center',
        backgroundColor: colors.backgroundColor,
        alignItems: 'center'
    },
    topContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: '80%'
    },
    image: {
        height: IMAGE_HEIGHT,
        minHeight: IMAGE_HEIGHT_SMALL,
        resizeMode: 'contain'
    },
    facebookButton: {
        borderRadius: 50,
        height: 50,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 18,
        marginBottom: 10,
        elevation: 5,
        backgroundColor: colors.facebookColor
    },
    signUpButton: {
        borderRadius: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        elevation: 5,
        marginTop: 10,
        backgroundColor: colors.cancelButtonColor
    },
    loginButton: {
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
    facebookIconContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    facebookIcon: {
        height: 20,
        width: 20,
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.whiteColor,
        fontWeight: 'bold',
        fontSize: 12,
        minWidth: '80%',
        textAlign: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    facebookAligner: {
        flex: 1
    },
    alreadyCustomerText: {
        fontWeight: 'bold',
    },
    loginButtonText: {
        color: colors.submitButtonColor,
        fontWeight: 'bold'
    },
    alreadyCustomerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 40,
    },
    errorContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        color: colors.submitButtonColor
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
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
)(InitialScreen);