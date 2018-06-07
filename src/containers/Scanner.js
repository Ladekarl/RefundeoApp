import React, {Component} from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-fa-icons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';

class ScannerScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        tabBarIcon: ({tintColor}) => {
            let newTintColor = tintColor === colors.activeTabColor ? colors.inactiveTabColor : colors.backgroundColor;
            if(Platform.OS === 'ios') {
                return (
                    <View style={styles.tabBarContainerIOs}>
                        <Icon name='camera' style={[styles.tabBarIconIOs, {color: newTintColor}]}/>
                    </View>
                );
            } else {
                return (
                    <Icon name='camera' style={[styles.tabBarIconAndroid, {color: tintColor}]}/>
                )
            }
        }
    };

    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    qrCodeScanner;

    constructor(props) {
        super(props);
    }

    componentWillUpdate() {
        if (!this.props.state.fetchingClaimRefundCase && this.qrCodeScanner) {
            this.qrCodeScanner.reactivate();
        }
    }

    onSuccess = (e) => {
        const refundCaseId = e.data;
        this.props.actions.claimRefundCase(refundCaseId);
    };

    render() {
        const {state} = this.props;
        const fetching = state.fetchingClaimRefundCase;
        const error = state.claimRefundCaseError;
        const navigation = state.navigation;

        return (
            <View style={styles.container}>
                {navigation.currentRoute === 'Scanner' &&
                <QRCodeScanner
                    onRead={this.onSuccess}
                    ref={ref => this.qrCodeScanner = ref}
                    containerStyle={styles.cameraContainer}
                    showMarker={true}
                    fadeIn={false}
                    customMarker={
                        <View style={styles.rectangleContainer}>
                            <View style={styles.rectangle}/>
                        </View>
                    }
                    reactivateTimeout={2}
                    topContent={
                        <View style={styles.cameraContentContainer}>
                            <Text style={styles.centerTopText}>
                                {strings('scanner.top_text')}
                            </Text>
                        </View>
                    }
                    bottomContent={
                        <View style={styles.cameraContentContainer}>
                            <Text style={styles.centerBottomText}>
                                {error}
                            </Text>
                        </View>
                    }
                    cameraStyle={styles.cameraStyle}
                />
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
        backgroundColor: colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    centerTopText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    centerBottomText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.cancelButtonColor
    },
    cameraStyle: {
        borderRadius: 2
    },
    cameraContentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: colors.activeTabColor,
        backgroundColor: 'transparent',
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    activityIndicator: {
        elevation: 10,
        backgroundColor: 'transparent'
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
            ...state.refundReducer
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
)(ScannerScreen);