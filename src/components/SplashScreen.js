import React, {Component} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import LocalStorage from '../storage/LocalStorage';
import colors from '../shared/colors';
import {NavigationActions} from 'react-navigation';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 2;

export default class SplashScreen extends Component {

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        LocalStorage.getUser().then(user => {
            if (user && user.email && user.password && user.uid) {
                this._navigateAndReset('mainFlow');
                this._signIn();
            } else {
                this._navigateAndReset('Login', true);
            }
        }).catch(() => {
                this._navigateAndReset('Login', true);
            }
        );
    }

    _signIn = () => {
        LocalStorage.getUser().then(user => {
            // TODO Sign in with email and password
            this._navigateAndReset('Login', true);
        }).catch(error => console.log(error));
    };

    _navigateAndReset = (routeName, isNested) => {
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: routeName})],
        });
        if (!isNested) {
            resetAction.key = null
        }
        this.props.navigation.dispatch(resetAction);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.topContainer}>
                        <Image
                            resizeMode='contain'
                            style={styles.image}
                            source={require('../../assets/images/refundeo_logo.png')}
                        />
                    </View>
                </View>
            </View>
        );
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
    },
    topContainer: {
        marginTop: '10%',
        marginBottom: '20%',
        marginLeft: '10%',
        marginRight: '10%',
        position: 'absolute',
        width: '100%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        height: IMAGE_HEIGHT,
        alignSelf: 'center',
        opacity: 0.8
    }
});