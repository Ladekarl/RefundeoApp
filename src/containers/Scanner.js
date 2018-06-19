import React, {Component} from 'react';
import {ActivityIndicator, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import ModalScreen from '../components/Modal';

class ScannerScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        title: 'Scanner'
    };

    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    qrCodeScanner;
    modalTextInput;
    secondTextInput;

    initialState = {
        customerId: '',
        amount: null,
        receiptNumber: '',
        modalInputError: ''
    };

    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    componentWillUpdate() {
        this.reactivateQrCodeScanner();
    }

    reactivateQrCodeScanner() {
        if (this.qrCodeScanner && !this.props.state.fetchingCreateRefundCase && !this.props.state.fetching && !this.props.state.navigation.modal['createRefundModal']) {
            this.qrCodeScanner.reactivate();
        }
    }

    onSuccess = (e) => {
        if (e.data) {
            const customerId = JSON.parse(e.data);
            this.setState({
                customerId
            });
            this.props.actions.getScannedUser(customerId, 'createRefundModal');
        }
    };

    closeModal = () => {
        this.props.actions.closeModal('createRefundModal');
        this.setState({
            ...this.initialState
        });
    };

    onModalSubmit = () => {
        let customerId = this.state.customerId;
        let receiptNumber = this.state.receiptNumber;
        let amount = this.state.amount;
        this.setState({
            modalInputError: 'Please fill all fields'
        });
        if (customerId && receiptNumber && amount) {
            this.props.actions.createRefundCase(customerId, receiptNumber, amount, 'createRefundSuccessModal');
            this.closeModal();
        } else if (customerId) {
            this.setState({
                modalInputError: 'Please fill all fields'
            });
        } else {
            this.setState({
                modalInputError: 'Could not find customer'
            });
        }
    };

    focusSecondTextInput = () => {
        if (this.secondTextInput) {
            this.secondTextInput.focus();
        } else {
            Keyboard.dismiss();
        }
    };

    changeAmount = (amount) => {
        this.setState({
            amount
        });
    };

    changeReceiptNumber = (receiptNumber) => {
        this.setState({
            receiptNumber
        });
    };

    closeSuccessModal = () => {
        this.props.actions.closeModal('createRefundSuccessModal');
    };

    render() {
        const {state} = this.props;
        const fetching = state.fetchingCreateRefundCase || state.fetching;
        const error = state.createRefundCaseError ? state.createRefundCaseError : state.getUserError;
        const modalOpen = state.navigation.modal['createRefundSuccessModal'] || state.navigation.modal['createRefundModal'];
        const navigation = state.navigation;

        return (
            <View style={styles.container}>
                {navigation.currentRoute === 'Scanner' && !modalOpen &&
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
                <ModalScreen
                    modalTitle={'Success'}
                    onBack={this.closeSuccessModal}
                    onCancel={this.closeSuccessModal}
                    onSubmit={this.closeSuccessModal}
                    visible={state.navigation.modal['createRefundSuccessModal'] || false}>
                    <View>
                        <Text
                            style={styles.headlineText}>{'Successfully created refund.\n\nAsk the customer to refresh the list of refunds'}</Text>
                    </View>
                </ModalScreen>
                <ModalScreen
                    modalTitle={'Fill all fields'}
                    visible={state.navigation.modal['createRefundModal'] && !fetching || false}
                    onSubmit={this.onModalSubmit}
                    onBack={this.closeModal}
                    fullScreen={true}
                    onCancel={this.closeModal}>
                    <ScrollView contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.headlineText}>Customer</Text>
                        <Text style={styles.modalInput}>{state.user.firstName + ' ' + state.user.lastName}</Text>
                        <Text style={styles.modalInput}>{state.user.email}</Text>
                        <Text style={styles.headlineText}>Amount</Text>
                        <TextInput
                            ref={(input) => this.modalTextInput = input}
                            style={styles.modalInput}
                            value={this.state.amount}
                            onChangeText={this.changeAmount}
                            autoFocus={true}
                            maxLength={64}
                            placeholder={'Amount'}
                            selectionColor={colors.inactiveTabColor}
                            underlineColorAndroid={colors.activeTabColor}
                            tintColor={colors.activeTabColor}
                            numberOfLines={1}
                            keyboardType={'numeric'}
                            editable={true}
                            returnKeyType={'next'}
                            onSubmitEditing={this.focusSecondTextInput}
                            blurOnSubmit={false}
                        />
                        <Text style={styles.headlineText}>Receipt number</Text>
                        <TextInput
                            ref={(input) => this.secondTextInput = input}
                            style={styles.modalInput}
                            value={this.state.receiptNumber}
                            maxLength={64}
                            onChangeText={this.changeReceiptNumber}
                            placeholder={'Receipt number'}
                            selectionColor={colors.inactiveTabColor}
                            autoCapitalize={'none'}
                            underlineColorAndroid={colors.activeTabColor}
                            tintColor={colors.activeTabColor}
                            numberOfLines={1}
                            keyboardType={'default'}
                            autoCorrect={false}
                            editable={true}
                            returnKeyType={'done'}
                        />
                        <Text style={styles.modalInputErrorText}>{this.state.modalInputError}</Text>
                    </ScrollView>
                </ModalScreen>
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
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.activeTabColor
    },
    centerBottomText: {
        fontSize: 17,
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
    },
    modalInput: {
        textAlign: 'center',
        minWidth: '80%',
        fontSize: 16,
        marginTop: Platform.OS === 'ios' ? 10 : 0
    },
    headlineText: {
        textAlign: 'center',
        marginLeft: 10,
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 17
    },
    modalInputErrorText: {
        textAlign: 'center',
        fontSize: 17,
        margin: 5,
        color: colors.cancelButtonColor
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
            ...state.refundReducer,
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
)(ScannerScreen);