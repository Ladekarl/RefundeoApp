import React, {Component} from 'react';
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    View
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import ModalScreen from '../components/Modal';
import SignatureCapture from 'react-native-signature-capture';
import Orientation from 'react-native-orientation';
import CustomText from '../components/CustomText';
import CustomTextInput from '../components/CustomTextInput';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class ScannerScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        title: strings('scanner.scanner')
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
        modalInputError: '',
        customerSignature: '',
        merchantSignature: ''
    };

    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    UNSAFE_componentWillUpdate() {
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
    };

    backModal = () => {
        this.closeModal();
        this.setState({
            ...this.initialState
        });
    };

    onModalSubmit = () => {
        let customerId = this.state.customerId;
        let receiptNumber = this.state.receiptNumber;
        let amount = this.state.amount;
        this.setState({
            modalInputError: strings('scanner.fill_all_fields')
        });
        if (customerId && receiptNumber && amount) {
            this.props.actions.openModal('signatureModal');
            this.closeModal();
            Orientation.lockToLandscapeLeft();
        } else if (customerId) {
            this.setState({
                modalInputError: strings('scanner.fill_all_fields')
            });
        } else {
            this.setState({
                modalInputError: strings('scanner.customer_not_found')
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

    sign;

    saveSign() {
        this.sign.saveImage();
    }

    resetSign() {
        this.sign.resetImage();
    }

    _onSaveEvent = (result) => {
        if (!this.state.customerSignature) {
            let customerSignature = result.encoded;
            this.sign.resetImage();
            this.setState({
                customerSignature
            });
            Orientation.lockToLandscapeRight();
        } else {
            let merchantSignature = result.encoded;
            this.setState({
                merchantSignature
            });
            let customerId = this.state.customerId;
            let receiptNumber = this.state.receiptNumber;
            let amount = this.state.amount;
            let customerSignature = this.state.customerSignature;
            this.props.actions.createRefundCase(customerId, receiptNumber, amount, customerSignature, merchantSignature, 'createRefundSuccessModal');
            this.closeSignatureModal();
        }
    };

    closeSignatureModal = () => {
        this.props.actions.closeModal('signatureModal');
        this.setState({
            ...this.initialState
        });
        Orientation.lockToPortrait();
    };

    render() {
        const {state} = this.props;
        const fetching = state.fetchingCreateRefundCase || state.fetching;
        const error = state.createRefundCaseError ? state.createRefundCaseError : state.getUserError;
        const signatureModalOpen = state.navigation.modal['signatureModal'] || false;
        const modalOpen = state.navigation.modal['createRefundSuccessModal'] || state.navigation.modal['createRefundModal'] || signatureModalOpen;
        const navigation = state.navigation;
        const customerSignature = this.state.customerSignature;

        return (
            <View style={styles.container}>
                {navigation.currentRoute === 'Scanner' && !modalOpen && !fetching &&
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
                            <CustomText style={styles.centerTopText}>
                                {strings('scanner.top_text')}
                            </CustomText>
                        </View>
                    }
                    bottomContent={
                        <View style={styles.cameraContentContainer}>
                            <CustomText style={styles.centerBottomText}>
                                {error}
                            </CustomText>
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
                        <CustomText
                            style={styles.headlineText}>{strings('scanner.create_refund_success')}</CustomText>
                    </View>
                </ModalScreen>
                <Modal
                    animationType='fade'
                    transparent={true}
                    onRequestClose={this.closeSignatureModal}
                    supportedOrientations={['portrait', 'landscape']}
                    visible={signatureModalOpen || false}>
                    <View style={styles.signRotate}>
                        <CustomText
                            style={styles.signatureText}>{customerSignature ? strings('scanner.merchant_signature') : strings('scanner.customer_signature')}</CustomText>
                        <SignatureCapture
                            style={styles.signature}
                            ref={ref => this.sign = ref}
                            onSaveEvent={this._onSaveEvent}
                            saveImageFileInExtStorage={false}
                            showNativeButtons={false}
                            showTitleLabel={false}
                            viewMode={'landscape'}/>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={() => {
                                    this.saveSign();
                                }}>
                                <CustomText style={styles.buttonText}>{strings('scanner.save')}</CustomText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={() => {
                                    this.resetSign();
                                }}>
                                <CustomText style={styles.buttonText}>{strings('scanner.reset')}</CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <ModalScreen
                    modalTitle={strings('scanner.create_refund_modal_title')}
                    visible={state.navigation.modal['createRefundModal'] && !fetching || false}
                    onSubmit={this.onModalSubmit}
                    onBack={this.backModal}
                    fullScreen={true}
                    onCancel={this.backModal}>
                    <ScrollView contentContainerStyle={styles.modalContainer}>
                        <CustomText style={styles.headlineText}>{strings('scanner.customer')}</CustomText>
                        <CustomText
                            style={styles.modalInput}>{state.otherUser.firstName + ' ' + state.otherUser.lastName}</CustomText>
                        <CustomText style={styles.modalInput}>{state.otherUser.email}</CustomText>
                        <CustomText style={styles.headlineText}>{strings('scanner.amount')}</CustomText>
                        <CustomTextInput
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
                        <CustomText style={styles.headlineText}>{strings('scanner.receipt_number')}</CustomText>
                        <CustomTextInput
                            ref={(input) => this.secondTextInput = input}
                            style={styles.modalInput}
                            value={this.state.receiptNumber}
                            maxLength={64}
                            onChangeText={this.changeReceiptNumber}
                            placeholder={strings('scanner.receipt_number')}
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
                        <CustomText style={styles.modalInputErrorText}>{this.state.modalInputError}</CustomText>
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
    },
    signature: {
        flex: 1,
        borderColor: colors.blackColor,
        borderWidth: 1,
    },
    signatureText: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: colors.activeTabColor,
        fontSize: 20,
        margin: 10,
        backgroundColor: colors.whiteColor
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        backgroundColor: colors.activeTabColor,
        margin: 10,
        marginBottom: Platform.OS === 'ios' ? 10 : 30
    },
    buttonText: {
        color: colors.backgroundColor
    },
    signRotate: {
        position: 'absolute',
        height: windowWidth,
        width: windowHeight,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.whiteColor
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