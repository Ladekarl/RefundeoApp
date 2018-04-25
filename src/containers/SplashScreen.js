import React, {Component} from 'react';
import {Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import LocalStorage from '../storage';
import {strings} from '../shared/i18n';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 2;
const CONTAINER_HEIGHT = window.height / 2;
const CONTAINER_HEIGHT_SMALL = window.height / 6;
const IMAGE_HEIGHT_SMALL = window.width / 2;

class SplashScreen extends Component {

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
        SplashScreen._shouldNavigate().then(shouldNavigate => {
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

    static async _shouldNavigate() {
        const user = await LocalStorage.getUser();
        return user && user.token;
    }

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

    render() {
        const {fetching} = this.props.state;
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
                    <TouchableOpacity style={styles.facebookButton}
                                      onPress={() => {
                                      }} // TODO something
                                      disabled={fetching}>
                        <Text style={styles.buttonText}>LOGIN WITH FACEBOOK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signUpButton}
                                      onPress={() => {
                                      }} // TODO something
                                      disabled={fetching}>
                        <Text style={styles.buttonText}>SIGN UP</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        marginBottom: 10,
        elevation: 5,
        backgroundColor: colors.submitButtonColor
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
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    buttonText: {
        color: colors.whiteColor
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
)(SplashScreen);