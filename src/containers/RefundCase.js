import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    Platform,
    TouchableOpacity,
    RefreshControl,
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
import FastImage from 'react-native-fast-image'

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
        return <FastImage style={styles.uploadImage}
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
        }
        else if (isRejected) {
            return <CustomText style={styles.rejectedText}>{strings('refund_case.denied')}</CustomText>;
        }
        else if (isRequested) {
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
        }
        else if (isRejected) {
            return <Icon style={styles.rejectedIcon} name='times-circle'/>;
        }
        else if (isRequested) {
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
                {merchant.banner &&
                <FastImage
                    style={styles.bannerImage}
                    source={{uri: merchant.banner}}
                    borderRadius={2}>
                    <View style={styles.flexIconContainer}>
                        <View style={styles.iconContainer}>
                            {merchant.logo &&
                            <FastImage style={styles.logoImage} resizeMode='contain'
                                       source={{uri: merchant.logo}}/>
                            }
                        </View>
                    </View>
                </FastImage>
                }
                <View style={styles.bannerTextBarContainer}>
                    <View style={styles.bannerContentContainer}>
                        <View style={styles.bannerColumnContainer}>
                            <CustomText style={styles.leftText}>{strings('refund_case.amount')}</CustomText>
                            <CustomText style={styles.leftText}>{strings('refund_case.refund_amount')}</CustomText>
                            <CustomText style={styles.leftText}>{strings('refund_case.receipt_number')}</CustomText>
                        </View>
                        <View style={styles.bannerColumnContainer}>
                            <CustomText
                                style={styles.contentText}>{refundCase.merchant.currency + ' ' + refundCase.amount.toFixed(1).replace(/[.,]0$/, '')}</CustomText>
                            <CustomText
                                style={styles.contentText}>{refundCase.merchant.currency + ' ' + refundCase.refundAmount.toFixed(1).replace(/[.,]0$/, '')}</CustomText>
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
                <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadVatPress}>
                    <View style={styles.uploadImageContainer}>
                        {vatImage}
                    </View>
                    <CustomText style={styles.buttonText}>{strings('refund_case.upload_tax_free_form')}</CustomText>
                    <Icon style={styles.angleRightIcon} name='angle-right'/>
                </TouchableOpacity>
                }
                {!refundCase.isRequested &&
                <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadReceiptPress}>
                    <View style={styles.uploadImageContainer}>
                        {receiptImage}
                    </View>
                    <CustomText style={styles.buttonText}>{strings('refund_case.upload_receipt')}</CustomText>
                    <Icon style={styles.angleRightIcon} name='angle-right'/>
                </TouchableOpacity>
                }
                {!refundCase.isRequested &&
                <TouchableOpacity disabled={fetchingRequestRefund || fetchingDocumentation || fetchingRefundCases}
                                  style={styles.submitButton}
                                  onPress={this.onRequestRefundPress}>
                    <CustomText style={styles.submitButtonText}>{strings('refund_case.send_documentation')}</CustomText>
                </TouchableOpacity>
                }
                {refundCase.isRequested &&
                <View style={styles.requestedContainer}>
                    {refundCaseIcon}
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
                    <ActivityIndicator size='large' color={colors.activeTabColor} style={styles.activityIndicator}/>
                </View>
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    hidden: {
        display: 'none'
    },
    container: {
        flex: 1,
        backgroundColor: colors.slightlyDarkerColor,
    },
    bannerImage: {
        width: '100%',
        height: 180
    },
    flexIconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor,
        borderRadius: 40,
        padding: 6,
        elevation: 2,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.separatorColor
    },
    logoImage: {
        height: 60,
        width: 60,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.activeTabColor,
        padding: 10
    },
    bannerContentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.activeTabColor,
    },
    bannerColumnContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    leftText: {
        margin: 5,
        color: colors.separatorColor
    },
    contentText: {
        margin: 5,
        color: colors.backgroundColor
    },
    descriptionContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        elevation: 1,
        flex: 1,
        borderColor: colors.activeTabColor,
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    emailContainer: {
        flex: 1,
        backgroundColor: colors.activeTabColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emailButtonContainer: {
        backgroundColor: colors.activeTabColor,
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
        flex: 1,
        height: undefined,
        width: undefined,
        borderRadius: 5
    },
    submitButton: {
        padding: 15,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.submitButtonColor,
        borderRadius: 4,
        elevation: 1,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkTextcolor
    },
    angleRightIcon: {
        height: undefined,
        width: undefined,
        fontSize: 30,
        marginLeft: 5,
        color: colors.activeTabColor
    },
    modalContainer: {
        paddingTop: 20,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalText: {
        fontSize: 18,
        color: colors.darkTextcolor,
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
        color: colors.greenButtonColor,
        fontSize: 20
    },
    approvedIcon: {
        color: colors.greenButtonColor,
        fontSize: 45,
        marginBottom: 10,
    },
    rejectedText: {
        color: colors.cancelButtonColor,
        fontSize: 20
    },
    rejectedIcon: {
        color: colors.cancelButtonColor,
        fontSize: 45,
        marginBottom: 10
    },
    requestedText: {
        color: colors.activeTabColor,
        fontSize: 20
    },
    requestedIcon: {
        color: colors.activeTabColor,
        fontSize: 45,
        marginBottom: 10
    },
    modalInput: {
        textAlign: 'center',
        minWidth: '80%',
        fontSize: 15
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
        backgroundColor: 'transparent'
    },
    activityIndicator: {
        elevation: 10,
        backgroundColor: 'transparent'
    },
    sendText: {
        color: colors.backgroundColor,
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center'
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