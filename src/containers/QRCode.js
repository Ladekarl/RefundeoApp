import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Platform, Image} from 'react-native';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import PropTypes from 'prop-types';

class QRCode extends Component {

    static propTypes = {
        state: PropTypes.object.isRequired
    };

    static navigationOptions = {
        tabBarIcon: ({tintColor}) => {
            let newTintColor = tintColor === colors.activeTabColor ? colors.inactiveTabColor : colors.backgroundColor;
            if (Platform.OS === 'ios') {
                return (
                    <View style={styles.tabBarContainerIOs}>
                        <Icon name='barcode' style={[styles.tabBarIconIOs, {color: newTintColor}]}/>
                    </View>
                );
            } else {
                return (
                    <Icon name='barcode' style={[styles.tabBarIconAndroid, {color: tintColor}]}/>
                );
            }
        }
    };

    render() {
        const {user} = this.props.state;
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.qrCode} source={{uri: 'data:image/png;base64,' + user.qrCode}}/>
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
        alignItems: 'center'
    },
    tabBarContainerIOs: {
        height: 60,
        width: 60,
        borderRadius: 100,
        backgroundColor: colors.activeTabColor,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    tabBarIconIOs: {
        fontSize: 25
    },
    tabBarIconAndroid: {
        fontSize: 20
    },
    imageContainer: {
        elevation: 5,
        borderRadius: 40,
        borderColor: colors.separatorColor,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0
    },
    qrCode: {
        height: 200,
        width: 200,
        borderRadius: 40
    }
});

const mapStateToProps = state => {
    return {
        state: {
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
)(QRCode);