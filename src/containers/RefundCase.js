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
    RefreshControl
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
            modalText: ''
        };
    }

    getVatImage = (refundCase) => {
        if (refundCase.vatFormImage) {
            return {uri: 'data:image/png;base64,' + refundCase.vatFormImage};
        }
        if (refundCase.tempVatFormImage) {
            return {uri: 'data:image/png;base64,' + refundCase.tempVatFormImage};
        }
        return this.getRefundeoLogo();
    };

    getReceiptImage = (refundCase) => {
        if (refundCase.receiptImage) {
            return {uri: 'data:image/png;base64,' + refundCase.receiptImage};
        }
        if (refundCase.tempReceiptImage) {
            return {uri: 'data:image/png;base64,' + refundCase.tempReceiptImage};
        }
        return this.getRefundeoLogo();
    };

    getRefundeoLogo = () => {
        return require('../../assets/refundeo_logo.png');
    };

    onRequestRefundPress = () => {
        const refundCase = this.props.state.selectedRefundCase;
        const hasTempImages = refundCase.tempReceiptImage && refundCase.tempVatFormImage;
        const hasImages = refundCase.receiptImage && refundCase.vatFormImage;
        const user = this.props.state.user;
        const missingInfo = Validation.missingUserInfo(user);
        const missingSwift = Validation.missingRequestRefundUserInfo(user);
        if (!hasTempImages && !hasImages && !refundCase.isRequested) {
            this.openRefundCaseModal('Missing documentation', 'Please upload stamped tax free form and receipt before requesting refund.');
        } else if (hasTempImages && !refundCase.isRequested && !missingSwift && !missingInfo) {
            this.requestRefund(() => {
                this.closeRefundCaseModal();
                this.props.actions.uploadDocumentation(refundCase, refundCase.tempVatFormImage, refundCase.tempReceiptImage);
            });
        } else if (missingInfo || missingSwift) {
            const modalText = missingSwift ? 'Before requesting the refund we need your Swift/BIC code and account number.' : ' Before requesting the refund we need a bit more information.';
            this.openRefundCaseModal('Missing information', modalText, () => {
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
        this.openRefundCaseModal('Are you sure?', 'You cannot change the images after requesting the refund', () => {
            submitFunction();
        });
    };

    openRefundCaseModal = (modalTitle, modalText, onSubmit = this.closeRefundCaseModal) => {
        this.setState({
            modalTitle,
            modalText
        });
        this.props.actions.openModal('refundCaseModal');
        this.onModalSubmit = onSubmit;
    };

    closeRefundCaseModal = () => {
        this.props.actions.closeModal('refundCaseModal');
    };

    onModalSubmit = this.closeRefundCaseModal;

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

    render() {
        const {state, actions} = this.props;
        const {navigation, selectedRefundCase, fetchingRefundCases} = state;
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
                    <View style={styles.bannerColumnContainer}>
                        <Text style={styles.leftText}>{'Purchase amount incl. VAT'}</Text>
                        <Text style={styles.leftText}>{'Refund amount'}</Text>
                    </View>
                    <View style={styles.bannerColumnContainer}>
                        <Text style={styles.contentText}>{refundCase.amount}</Text>
                        <Text style={styles.contentText}>{refundCase.refundAmount}</Text>
                    </View>
                </View>
                {!refundCase.isRequested &&
                <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadVatPress}>
                    <View style={styles.uploadImageContainer}>
                        <Image style={styles.uploadImage} resizeMode='cover'
                               source={vatImage}/>
                    </View>
                    <Text style={styles.buttonText}>Upload tax free form</Text>
                    <Icon style={styles.angleRightIcon} name='angle-right'/>
                </TouchableOpacity>
                }
                {!refundCase.isRequested &&
                <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadReceiptPress}>
                    <View style={styles.uploadImageContainer}>
                        <Image style={styles.uploadImage} rresizeMode='cover'
                               source={receiptImage}/>
                    </View>
                    <Text style={styles.buttonText}>Upload receipt</Text>
                    <Icon style={styles.angleRightIcon} name='angle-right'/>
                </TouchableOpacity>
                }
                {!refundCase.isRequested &&
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={this.onRequestRefundPress}>
                        <Text style={styles.submitButtonText}>Request Refund</Text>
                    </TouchableOpacity>
                </View>
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
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
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
    bannerColumnContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
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
    uploadImageContainer: {
        borderRadius: 5
    },
    uploadImage: {
        height: 100,
        width: 100,
        borderRadius: 5
    },
    buttonContainer: {
        flex: 1
    },
    submitButton: {
        margin: 20,
        alignItems: 'center',
        backgroundColor: colors.submitButtonColor,
        borderRadius: 4,
        elevation: 1
    },
    submitButtonText: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
        color: colors.backgroundColor,
        fontWeight: 'bold'
    },
    buttonText: {
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