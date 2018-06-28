import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Image,
    Platform,
    TouchableOpacity,
    RefreshControl, TextInput, ActivityIndicator
} from 'react-native';
import {formatDate, strings} from '../shared/i18n';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import ModalScreen from '../components/Modal';
import Validation from '../shared/Validation';
import LocalStorage from '../storage';

class RefundCase extends Component {

    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('receiptNumber', '...'),
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
        const refundCase = this.props.state.selectedRefundCase;
        if (!refundCase.receiptImage) {
            LocalStorage.getReceiptImage(refundCase.id).then((tempReceiptImage) => {
                this.setState({tempReceiptImage});
            });
        }
        if (!refundCase.vatFormImage) {
            LocalStorage.getVatFormImage(refundCase.id).then((tempVatFormImage) => {
                this.setState({tempVatFormImage});
            });
        }
    }

    getVatImage = (refundCase) => {
        if (refundCase.vatFormImage) {
            return <Image style={styles.uploadImage} resizeMode='cover'
                          source={{uri: 'data:image/png;base64,' + refundCase.vatFormImage}}/>;
        }
        if (this.state.tempVatFormImage) {
            return <Image style={styles.uploadImage} resizeMode='cover'
                          source={{uri: 'data:image/png;base64,' + this.state.tempVatFormImage}}/>;
        }
        return <Image style={styles.uploadImage} resizeMode='cover'
                      source={require('../../assets/tax_form.png')}/>;
    };

    getReceiptImage = (refundCase) => {
        if (refundCase.receiptImage) {
            return <Image style={styles.uploadImage} resizeMode='cover'
                          source={{uri: 'data:image/png;base64,' + refundCase.receiptImage}}/>;
        }
        if (this.state.tempReceiptImage) {
            return <Image style={styles.uploadImage} resizeMode='cover'
                          source={{uri: 'data:image/png;base64,' + this.state.tempReceiptImage}}/>;
        }
        return <Image style={styles.uploadImage} resizeMode='contain'
                      source={require('../../assets/receipt.png')}/>;
    };

    onRequestRefundPress = () => {
        const refundCase = this.props.state.selectedRefundCase;
        const hasTempImages = refundCase.tempReceiptImage && refundCase.tempVatFormImage;
        const hasImages = refundCase.receiptImage && refundCase.vatFormImage;
        const user = this.props.state.user;
        const missingInfo = Validation.missingUserInfo(user);
        const missingSwift = Validation.missingRequestRefundUserInfo(user);
        if (!hasTempImages && !hasImages && !refundCase.isRequested) {
            this.openRefundCaseModal(strings('refund_case.missing_documentation_title'), strings('refund_case.missing_documentation_text'), this.closeRefundCaseModal);
        } else if (hasTempImages && !refundCase.isRequested && !missingSwift && !missingInfo) {
            this.requestRefund(() => {
                this.closeRefundCaseModal();
                this.props.actions.uploadDocumentation(refundCase, refundCase.tempVatFormImage, refundCase.tempReceiptImage);
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
            return <Text style={styles.approvedText}>{strings('refund_case.approved')}</Text>;
        }
        else if (isRejected) {
            return <Text style={styles.rejectedText}>{strings('refund_case.denied')}</Text>;
        }
        else if (isRequested) {
            return <Text
                style={styles.requestedText}>{strings('refund_case.pending_approval')}</Text>;
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
        const {navigation, selectedRefundCase, fetchingRefundCases, fetchingSendEmail, fetchingRequestRefund} = state;
        const refundCase = selectedRefundCase;
        const {merchant} = refundCase;

        const receiptImage = this.getReceiptImage(refundCase);
        const vatImage = this.getVatImage(refundCase);
        const refundCaseText = this.getRefundCaseText(refundCase);
        const refundCaseIcon = this.getRefundCaseIcon(refundCase);
        const refundDate = formatDate(new Date(refundCase.dateCreated));
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        tintColor={colors.activeTabColor}
                        refreshing={fetchingRefundCases || fetchingSendEmail || fetchingRequestRefund}
                        onRefresh={() => actions.getSelectedRefundCase(refundCase.id)}
                    />
                }>
                <ImageBackground
                    style={styles.bannerImage}
                    source={{uri: 'data:image/png;base64,' + merchant.banner}}
                    borderRadius={2}>
                    <View style={styles.iconContainer}>
                        <Image style={styles.logoImage} resizeMode='contain'
                               source={{uri: 'data:image/png;base64,' + merchant.logo}}/>
                    </View>
                </ImageBackground>
                <View style={styles.bannerTextBarContainer}>
                    <View style={styles.bannerContentContainer}>
                        <View style={styles.bannerColumnContainer}>
                            <Text style={styles.leftText}>{strings('refund_case.amount')}</Text>
                            <Text style={styles.leftText}>{strings('refund_case.refund_amount')}</Text>
                            <Text style={styles.leftText}>{strings('refund_case.date_created')}</Text>
                        </View>
                        <View style={styles.bannerColumnContainer}>
                            <Text
                                style={styles.contentText}>{refundCase.merchant.currency + ' ' + refundCase.amount.toFixed(2).replace(/[.,]00$/, '')}</Text>
                            <Text
                                style={styles.contentText}>{refundCase.merchant.currency + ' ' + refundCase.refundAmount.toFixed(2).replace(/[.,]00$/, '')}</Text>
                            <Text style={styles.contentText}>{refundDate}</Text>
                        </View>
                    </View>
                    {!refundCase.isRequested &&
                    <View style={styles.emailContainer}>
                        <TouchableOpacity style={styles.emailButtonContainer} onPress={this.onEmailPress}>
                            <Icon style={styles.emailIcon} name='share-square'/>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
                {!refundCase.isRequested &&
                <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadVatPress}>
                    <View style={styles.uploadImageContainer}>
                        {vatImage}
                    </View>
                    <Text style={styles.buttonText}>{strings('refund_case.upload_tax_free_form')}</Text>
                    <Icon style={styles.angleRightIcon} name='angle-right'/>
                </TouchableOpacity>
                }
                {!refundCase.isRequested &&
                <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadReceiptPress}>
                    <View style={styles.uploadImageContainer}>
                        {receiptImage}
                    </View>
                    <Text style={styles.buttonText}>{strings('refund_case.upload_receipt')}</Text>
                    <Icon style={styles.angleRightIcon} name='angle-right'/>
                </TouchableOpacity>
                }
                {!refundCase.isRequested &&
                <TouchableOpacity disabled={fetchingRequestRefund} style={styles.submitButton}
                                  onPress={this.onRequestRefundPress}>
                    <Text style={styles.submitButtonText}>{strings('refund_case.send_documentation')}</Text>
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
                        <Text style={styles.modalText}>{this.state.modalText}</Text>
                    </View>
                </ModalScreen>
                <ModalScreen
                    modalTitle={'Send tax free form'}
                    onBack={this.closeEmailModal}
                    onCancel={this.closeEmailModal}
                    onSubmit={this.onEmailModalSubmit}
                    visible={navigation.modal['emailModal'] || false}>
                    <View style={styles.modalContainer}>
                        <TextInput
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
                        <Text
                            style={!this.state.email || !this.state.isValidEmail ? styles.modalInputErrorText : styles.hidden}>{strings('refund_case.invalid_email')}</Text>
                    </View>
                </ModalScreen>
                {this.props.state.fetchingRequestRefund &&
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
        height: 180,
        justifyContent: 'center',
        alignItems: 'center'
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