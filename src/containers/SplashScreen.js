import React, {Component} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import colors from '../shared/colors';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 2;

class SplashScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        header: null
    };

    static propTypes = {
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.actions.navigateInitial();
    }

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
    }
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

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation
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