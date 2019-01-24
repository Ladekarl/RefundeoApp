import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    RefreshControl,
    Platform,
    ActivityIndicator
} from 'react-native';
import {strings} from '../shared/i18n';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import ModalScreen from '../components/Modal';
import Validation from '../shared/Validation';
import LocalStorage from '../storage';
import CustomText from '../components/CustomText';
import CustomTextInput from '../components/CustomTextInput';
import FastImage from 'react-native-fast-image';
import PlaceHolderFastImage from '../components/PlaceHolderFastImage';
import {SafeAreaView} from 'react-navigation';

class RefundCase extends Component {

    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('dateCreated', '...'),
            headerTitleStyle: {
                fontSize: 18
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            modalTitle: '',
            modalText: '',
            tempVatFormImage: undefined,
            tempReceiptImage: undefined,
            email: this.props.state.user.email,
            isValidEmail: Validation.validateEmail(this.props.state.user.email)
        };
    }

    componentDidMount() {
        this.getTempImages();
    }

    getTempImages() {
        const refundCase = this.props.state.selectedRefundCase;
        let receiptPromise;
        let vatFormPromise;

        if (!refundCase.vatFormImage &&
            (refundCase.tempVatFormImage !== this.state.tempVatFormImage || !this.state.tempReceiptImage)) {
            vatFormPromise = LocalStorage.getVatFormImage(refundCase.id);
        }
        if (!refundCase.receiptImage &&
            (refundCase.tempReceiptImage !== this.state.tempReceiptImage || !this.state.tempReceiptImage)) {
            receiptPromise = LocalStorage.getReceiptImage(refundCase.id);
        }

        Promise.all([receiptPromise, vatFormPromise]).then(([tempReceiptImage, tempVatFormImage]) => {
            this.setState({
                tempVatFormImage,
                tempReceiptImage
            });
        });
    }

    getVatImage = (refundCase) => {
        if (refundCase.vatFormImage) {
            return <Image style={styles.uploadImage}
                          source={{uri: 'data:image/png;base64,' + refundCase.vatFormImage}}/>;
        }
        if (refundCase.tempVatFormImage) {
            return <Image style={styles.uploadImage}
                          source={{uri: 'data:image/png;base64,' + refundCase.tempVatFormImage}}/>;
        }
        if (this.state.tempVatFormImage) {
            return <Image style={styles.uploadImage}
                          source={{uri: 'data:image/png;base64,' + this.state.tempVatFormImage}}/>;
        }
        return <FastImage style={styles.uploadImage}
                          source={require('../../assets/tax_form.png')}/>;
    };

    getReceiptImage = (refundCase) => {
        if (refundCase.receiptImage) {
            return <Image style={styles.uploadImage}
                          source={{uri: 'data:image/png;base64,' + refundCase.receiptImage}}/>;
        }
        if (refundCase.tempReceiptImage) {
            return <Image style={styles.uploadImage}
                          source={{uri: 'data:image/png;base64,' + refundCase.tempReceiptImage}}/>;
        }
        if (this.state.tempReceiptImage) {
            return <Image style={styles.uploadImage}
                          source={{uri: 'data:image/png;base64,' + this.state.tempReceiptImage}}/>;
        }
        return <FastImage style={styles.receiptImage}
                          resizeMode={FastImage.resizeMode.contain}
                          source={require('../../assets/receipt.png')}/>;
    };

    onRequestRefundPress = () => {
        const refundCase = this.props.state.selectedRefundCase;
        const hasTempImages = refundCase.tempReceiptImage && refundCase.tempVatFormImage;
        const hasTempStateImages = this.state.tempReceiptImage && this.state.tempVatFormImage;
        const hasImages = refundCase.receiptImage && refundCase.vatFormImage;
        const user = this.props.state.user;
        const missingInfo = Validation.missingUserInfo(user);
        const missingSwift = Validation.missingRequestRefundUserInfo(user);
        if (!hasTempImages && !hasTempStateImages && !hasImages && !refundCase.isRequested) {
            this.openRefundCaseModal(strings('refund_case.missing_documentation_title'), strings('refund_case.missing_documentation_text'), this.closeRefundCaseModal);
        } else if ((hasTempImages || hasTempStateImages) && !refundCase.isRequested && !missingSwift && !missingInfo) {
            this.requestRefund(() => {
                this.closeRefundCaseModal();
                this.props.actions.uploadDocumentation(
                    refundCase,
                    hasTempImages ? refundCase.tempVatFormImage : this.state.tempVatFormImage,
                    hasTempImages ? refundCase.tempReceiptImage : this.state.tempReceiptImage);
            });
        } else if (missingInfo || missingSwift) {
            const modalText = missingSwift ? strings('refund_case.missing_information_swift_text') : strings('refund_case.missing_information_other_text');
            this.openRefundCaseModal(strings('refund_case.missing_information_title'), modalText, () => {
                this.closeRefundCaseModal();
                const missingInfo = Validation.missingUserInfo(user);
                const missingSwift = Validation.missingRequestRefundUserInfo(user);
                if (missingInfo) {
                    this.props.actions.navigateRegisterExtra();
                } else if (missingSwift) {
                    this.props.actions.navigateSettings();
                }
            });
        } else {
            this.requestRefund(() => {
                this.closeRefundCaseModal();
                this.props.actions.requestRefund(refundCase);
            });
        }
    };

    requestRefund = (submitFunction) => {
        this.openRefundCaseModal(strings('refund_case.request_title'), strings('refund_case.request_text'), () => {
            submitFunction();
        });
    };

    openRefundCaseModal = (modalTitle, modalText, onSubmit) => {
        this.setState({
            modalTitle,
            modalText
        });
        this.props.actions.openModal('refundCaseModal');
        this.onModalSubmit = onSubmit;
    };

    openEmailModal = () => {
        this.props.actions.openModal('emailModal');
    };

    closeRefundCaseModal = () => {
        this.props.actions.closeModal('refundCaseModal');
    };

    closeEmailModal = () => {
        this.props.actions.closeModal('emailModal');
    };

    onModalSubmit = this.closeRefundCaseModal;

    onEmailModalSubmit = () => {
        const email = this.state.email;
        const isValid = Validation.validateEmail(email);
        if (email && isValid) {
            this.props.actions.sendVatFormEmail(this.props.state.selectedRefundCase, email);
            this.closeEmailModal();
        }
    };

    onUploadVatPress = () => {
        this.props.actions.selectUploadDocumentation('vatFormImage');
    };

    onUploadReceiptPress = () => {
        this.props.actions.selectUploadDocumentation('receiptImage');
    };

    getRefundCaseText = (refundCase) => {
        const isAccepted = refundCase.isAccepted;
        const isRejected = refundCase.isRejected;
        const isRequested = refundCase.isRequested;

        if (isAccepted) {
            return <CustomText style={styles.approvedText}>{strings('refund_case.approved')}</CustomText>;
        } else if (isRejected) {
            return <CustomText style={styles.rejectedText}>{strings('refund_case.denied')}</CustomText>;
        } else if (isRequested) {
            return <CustomText
                style={styles.requestedText}>{strings('refund_case.pending_approval')}</CustomText>;
        }
    };

    getRefundCaseIcon = (refundCase) => {
        const isAccepted = refundCase.isAccepted;
        const isRejected = refundCase.isRejected;
        const isRequested = refundCase.isRequested;

        if (isAccepted) {
            return <Icon style={styles.approvedIcon} name='check-circle'/>;
        } else if (isRejected) {
            return <Icon style={styles.rejectedIcon} name='times-circle'/>;
        } else if (isRequested) {
            return <Icon style={styles.requestedIcon} name='thumbs-up'/>;
        }
    };

    onEmailPress = () => {
        this.openEmailModal();
    };

    changeEmail = (email) => {
        const isValidEmail = Validation.validateEmail(email);
        this.setState({
            email: email,
            isValidEmail
        });
    };

    render() {
        const {state, actions} = this.props;
        const {navigation, selectedRefundCase, fetchingRefundCases, fetchingSendEmail, fetchingRequestRefund, fetchingDocumentation} = state;
        const refundCase = selectedRefundCase;
        const {merchant} = refundCase;

        const receiptImage = this.getReceiptImage(refundCase);
        const vatImage = this.getVatImage(refundCase);
        const refundCaseText = this.getRefundCaseText(refundCase);
        const refundCaseIcon = this.getRefundCaseIcon(refundCase);
        return (
            <SafeAreaView style={styles.container} forceInset={{'bottom': 'always'}}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.container}
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.activeTabColor}
                            refreshing={fetchingRefundCases}
                            onRefresh={() => actions.getSelectedRefundCase(refundCase.id)}
                        />
                    }>
                    <PlaceHolderFastImage
                        style={styles.bannerImage}
                        placeholder={
                            <FastImage
                                resizeMode={FastImage.resizeMode.contain}
                                style={styles.placeHolderImage}
                                source={require('../../assets/refundeo_banner_medium.png')}/>
                        }
                        source={{uri: merchant.banner}}
                        borderRadius={2}>
                    </PlaceHolderFastImage>
                    <View style={styles.bannerTextBarContainer}>
                        <View style={styles.bannerContentContainer}>
                            <View style={styles.bannerColumnContainer}>
                                <CustomText style={styles.leftText}>{strings('refund_case.amount')}</CustomText>
                                <CustomText style={styles.leftText}>{strings('refund_case.refund_amount')}</CustomText>
                                <CustomText style={styles.leftText}>{strings('refund_case.receipt_number')}</CustomText>
                            </View>
                            <View style={styles.bannerColumnContainer}>
                                <CustomText
                                    style={styles.contentText}>{refundCase.merchant.currency + ' ' + refundCase.amount.toFixed(2).replace(/[.,]00$/, '')}</CustomText>
                                <CustomText
                                    style={styles.contentText}>{refundCase.merchant.currency + ' ' + refundCase.refundAmount.toFixed(2).replace(/[.,]00$/, '')}</CustomText>
                                <CustomText style={styles.contentText}>{refundCase.receiptNumber}</CustomText>
                            </View>
                        </View>
                        {!refundCase.isRequested &&
                        <View style={styles.emailContainer}>
                            <TouchableOpacity style={styles.emailButtonContainer} onPress={this.onEmailPress}>
                                <Icon style={styles.emailIcon} name='share-square'/>
                                <CustomText style={styles.sendText}>{strings('refund_case.send_form')}</CustomText>
                            </TouchableOpacity>
                        </View>
                        }
                    </View>
                    {!refundCase.isRequested &&
                    <View style={styles.notRequestedContainer}>
                        <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadVatPress}>
                            <View style={styles.uploadImageContainer}>
                                {vatImage}
                            </View>
                            <CustomText
                                style={styles.buttonText}>{strings('refund_case.upload_tax_free_form')}</CustomText>
                            <Icon style={styles.angleRightIcon} name='angle-right'/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadReceiptPress}>
                            <View style={styles.uploadImageContainer}>
                                {receiptImage}
                            </View>
                            <CustomText style={styles.buttonText}>{strings('refund_case.upload_receipt')}</CustomText>
                            <Icon style={styles.angleRightIcon} name='angle-right'/>
                        </TouchableOpacity>
                    </View>
                    }
                    {!refundCase.isRequested &&
                    <TouchableOpacity
                        disabled={fetchingRequestRefund || fetchingDocumentation || fetchingRefundCases}
                        style={styles.submitButton}
                        onPress={this.onRequestRefundPress}>
                        <CustomText
                            style={styles.submitButtonText}>{strings('refund_case.send_documentation')}</CustomText>
                    </TouchableOpacity>
                    }
                    {refundCase.isRequested &&
                    <View style={styles.requestedContainer}>
                        <View style={styles.topContainer}>
                            <View style={styles.outerContainer}>
                                {refundCaseIcon}
                            </View>
                        </View>
                        {refundCaseText}
                    </View>
                    }
                    <ModalScreen
                        modalTitle={this.state.modalTitle}
                        onBack={this.closeRefundCaseModal}
                        onCancel={this.closeRefundCaseModal}
                        onSubmit={this.onModalSubmit}
                        visible={navigation.modal['refundCaseModal'] || false}>
                        <View style={styles.modalContainer}>
                            <CustomText style={styles.modalText}>{this.state.modalText}</CustomText>
                        </View>
                    </ModalScreen>
                    <ModalScreen
                        modalTitle={strings('refund_case.send_modal_title')}
                        onBack={this.closeEmailModal}
                        onCancel={this.closeEmailModal}
                        onSubmit={this.onEmailModalSubmit}
                        visible={navigation.modal['emailModal'] || false}>
                        <View style={styles.modalContainer}>
                            <CustomTextInput
                                style={styles.modalInput}
                                value={this.state.email}
                                onChangeText={this.changeEmail}
                                autoFocus={true}
                                maxLength={64}
                                placeholder={strings('settings.email_placeholder')}
                                selectionColor={colors.inactiveTabColor}
                                underlineColorAndroid={colors.activeTabColor}
                                tintColor={colors.activeTabColor}
                                numberOfLines={1}
                                keyboardType='email-address'
                                editable={true}
                                returnKeyType='done'
                                autoCapitalize='none'
                                autoCorrect={false}
                                blurOnSubmit={false}
                            />
                            <CustomText
                                style={!this.state.email || !this.state.isValidEmail ? styles.modalInputErrorText : styles.hidden}>{strings('refund_case.invalid_email')}</CustomText>
                        </View>
                    </ModalScreen>
                    {(fetchingRequestRefund || fetchingDocumentation || fetchingSendEmail) &&
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color={colors.activeTabColor}/>
                    </View>
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    hidden: {
        display: 'none'
    },
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    bannerImage: {
        width: '100%',
        height: 180
    },
    placeHolderImage: {
        width: '90%',
        height: 160,
        alignSelf: 'center'
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.whiteColor,
        padding: 10
    },
    bannerContentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    bannerColumnContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    leftText: {
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        color: colors.darkTextColor
    },
    contentText: {
        margin: 5,
        color: colors.backgroundColor
    },
    notRequestedContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    descriptionContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        borderColor: colors.activeTabColor,
        borderRadius: 5,
        borderWidth: 2,
        backgroundColor: colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    emailContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emailButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadImageContainer: {
        borderRadius: 5,
        flex: 1
    },
    emailIcon: {
        textAlign: 'center',
        fontSize: 30,
        marginLeft: 5,
        marginRight: 5,
        color: colors.backgroundColor
    },
    uploadImage: {
        height: 70,
        width: undefined,
        borderRadius: 5
    },
    receiptImage: {
        height: 70,
        width: undefined,
        borderRadius: 5,
        tintColor: colors.whiteColor
    },
    submitButton: {
        padding: 15,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.whiteColor,
        borderRadius: 4,
        height: 50,
    },
    submitButtonText: {
        flex: 1,
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        color: colors.backgroundColor,
        fontWeight: 'bold'
    },
    buttonText: {
        flex: 3,
        marginLeft: 10,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.whiteColor
    },
    angleRightIcon: {
        height: undefined,
        width: undefined,
        fontSize: 30,
        marginLeft: 5,
        color: colors.whiteColor
    },
    modalContainer: {
        paddingTop: 20,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalText: {
        fontSize: 18,
        color: colors.whiteColor,
        textAlign: 'center',
        margin: 5
    },
    requestedContainer: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    approvedText: {
        color: colors.whiteColor,
        fontSize: 20,
        fontWeight: 'bold'
    },
    rejectedText: {
        color: colors.whiteColor,
        fontSize: 20,
        fontWeight: 'bold'
    },
    requestedText: {
        color: colors.whiteColor,
        fontSize: 20,
        fontWeight: 'bold'
    },
    approvedIcon: {
        color: colors.greenButtonColor,
        fontSize: 100
    },
    rejectedIcon: {
        color: colors.cancelButtonColor,
        fontSize: 100
    },
    requestedIcon: {
        color: colors.whiteColor,
        fontSize: 70
    },
    modalInput: {
        textAlign: 'center',
        minWidth: '80%',
        fontSize: 15,
        color: colors.whiteColor
    },
    modalInputErrorText: {
        marginTop: 10,
        textAlign: 'center',
        color: colors.cancelButtonColor
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.transparent
    },
    sendText: {
        color: colors.backgroundColor,
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center'
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
    },
    outerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.addButtonOuterColor,
        backgroundColor: colors.addButtonInnerColor,
        borderRadius: 200,
        height: 110,
        width: 110
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
)(RefundCase);