import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';

class OverviewScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        tabBarIcon: ({tintColor}) => (
            <Icon name='home' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    static propTypes = {
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            shouldShowCamera: false
        }
    }

    navigateScanner = () => {
        this.props.actions.navigateScanner();
    };

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.topContainer}>
                        <Text style={styles.buttonText}>
                            Velkommen til Refundeo
                        </Text>
                    </View>
                    <View style={styles.middleContainer}>
                        <TouchableOpacity style={styles.logoButtonContainer} onPress={this.navigateScanner}>
                            <Image style={styles.logoButton}
                                   source={require('../../assets/images/refundeo_logo.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.buttonText}>
                            For at starte skal du trykke på knappen og scanne QR koden på din kvittering
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    logoButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: colors.slightlyDarkerColor,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 200,
        zIndex: 0
    },
    logoButton: {
        zIndex: 9999,
        margin: 15
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        padding: 32
    },
    bottomContainer: {
        flex: 1
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    tabBarIcon: {
        fontSize: Platform.OS === 'ios' ? 20 : 15
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
)(OverviewScreen);