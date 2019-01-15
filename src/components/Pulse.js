import React, {PureComponent} from 'react';
import {View, StyleSheet, Animated, Easing, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

const {height, width} = Dimensions.get('window');

export default class Pulse extends PureComponent {

    static propTypes = {
        size: PropTypes.number.isRequired,
        pulseMaxSize: PropTypes.number.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        interval: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.anim = new Animated.Value(1);
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        this.anim.setValue(0);
        Animated.timing(this.anim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.linear,
            isInteraction: false
        }).start(this.animate.bind(this));

    }

    render() {
        const {size, pulseMaxSize, backgroundColor} = this.props;

        return (
            <View style={[styles.circleWrapper, {
                width: pulseMaxSize,
                height: pulseMaxSize,
                marginLeft: -pulseMaxSize / 2,
                marginTop: -pulseMaxSize / 2,
            }]}>
                <Animated.View
                    style={[styles.circle, {
                        backgroundColor,
                        width: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        height: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        borderRadius: pulseMaxSize / 2,
                        opacity: this.anim.interpolate({
                            inputRange: [0.1, 0.6],
                            outputRange: [0.6, 0.1]
                        })
                    }]}
                />
                <FastImage
                    source={require('../../assets/refundeo_logo.png')}
                    style={[styles.image, {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    }]}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    circleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: width / 2,
        top: height / 2,
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute'

    }
});