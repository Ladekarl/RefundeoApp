import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    TouchableOpacity,
    Vibration,
    ActivityIndicator
} from 'react-native';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {RNCamera} from 'react-native-camera';
import {strings} from '../shared/i18n';
import ModalScreen from '../components/Modal';
import CustomText from '../components/CustomText';

class UploadDocumentation extends Component {

    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            takingPicture: false
        };
    }

    takePicture = async () => {
        if (this.camera) {
            const options = {
                forceUpOrientation: true,
                fixOrientation: true,
                quality: 0.5,
                base64: true
            };
            this.setState({
                takingPicture: true
            });
            try {
                const data = await this.camera.takePictureAsync(options);
                await this.savePicture(data.base64);
                this.setState({
                    takingPicture: false
                });
            }
            catch (error) {
                this.setState({
                    takingPicture: false
                });
            }
        }
    };

    savePicture = async (picture) => {
        const page = this.state.page;
        const selectedDocumentation = this.props.state.selectedDocumentation;
        const refundCase = this.props.state.selectedRefundCase;
        if (page === 1) {
            const vatFormImage = !!refundCase.tempVatFormImage || !!refundCase.vatFormImage;
            const receiptImage = !!refundCase.receiptImage || !!refundCase.receiptImage;
            if (selectedDocumentation === 'vatFormImage') {
                this.props.actions.uploadTempVatFormImage(refundCase.id, picture, false);
                if (receiptImage) {
                    this.props.actions.navigateBack();
                }
            }
            if (selectedDocumentation === 'receiptImage') {
                this.props.actions.uploadTempReceiptImage(refundCase.id, picture, false);
                if (vatFormImage) {
                    this.props.actions.navigateBack();
                }
            }
            this.setState({page: 2});
        }
        if (page === 2) {
            if (selectedDocumentation !== 'vatFormImage') {
                this.props.actions.uploadTempVatFormImage(refundCase.id, picture, true);
            }
            if (selectedDocumentation !== 'receiptImage') {
                this.props.actions.uploadTempReceiptImage(refundCase.id, picture, true);
            }
        }
    };

    onQrCodeScan = (e) => {
        Vibration.vibrate();
        if (e.data) {
            let refundCaseId;
            try {
                refundCaseId = JSON.parse(e.data);
            } catch (e) {
                this.props.actions.openModal('uploadDocumentationModal');
            }
            if (refundCaseId && this.props.state.selectedRefundCase.id === refundCaseId) {
                this.setState({page: 1});
                return;
            }
        }
        this.props.actions.openModal('uploadDocumentationModal');
    };

    getTopText = (page, selectedDocumentation) => {
        if (page === 0) {
            return strings('upload_documentation.scan_qrcode');
        }
        if (page === 1) {
            if (selectedDocumentation === 'vatFormImage') {
                return strings('upload_documentation.picture_tff');
            }
            if (selectedDocumentation === 'receiptImage') {
                return strings('upload_documentation.picture_receipt');
            }
        }
        if (page === 2) {
            if (selectedDocumentation !== 'vatFormImage') {
                return strings('upload_documentation.picture_tff');
            }
            if (selectedDocumentation !== 'receiptImage') {
                return strings('upload_documentation.picture_receipt');
            }
        }
    };

    skipPressed = () => {
        this.props.actions.navigateBack();
    };

    closeUploadDocumentationModal = () => {
        this.props.actions.closeModal('uploadDocumentationModal');
    };

    render() {
        const {state} = this.props;
        const {selectedDocumentation} = state;
        const page = this.state.page;
        const takingPicture = this.state.takingPicture;
        const topText = this.getTopText(page, selectedDocumentation);
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.camera}
                    type={RNCamera.Constants.Type.back}
                    onBarCodeRead={page === 0 ? this.onQrCodeScan : undefined}
                    permissionDialogTitle={strings('refund_case.permission_title')}
                    permissionDialogMessage={strings('refund_case.permission_text')}>
                    <View style={styles.topContainer}>
                        <View style={styles.topTextContainer}>
                            <CustomText style={styles.topText}>{topText}</CustomText>
                        </View>
                    </View>
                    <View style={styles.centerContainer}>
                        {page === 0 &&
                        <View style={styles.rectangle}/>
                        }
                    </View>
                    <View style={styles.bottomContainer}>
                        <View style={styles.leftContainer}>
                            <TouchableOpacity
                                onPress={this.skipPressed}
                                disabled={page !== 2 || takingPicture}
                                style={page === 2 ? styles.skipButton : styles.hiddenButton}>
                                <CustomText style={styles.skipText}>Skip</CustomText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.centerRowContainer}>
                            <TouchableOpacity
                                onPress={this.takePicture}
                                disabled={page === 0 || takingPicture}
                                style={page > 0 ? styles.pictureButton : styles.hiddenButton}>
                                <Icon style={styles.pictureIcon} name='camera'/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rightContainer}></View>
                    </View>
                </RNCamera>
                {takingPicture &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.activeTabColor} style={styles.activityIndicator}/>
                </View>
                }
                <ModalScreen
                    modalTitle={strings('upload_documentation.wrong_qr_code')}
                    onBack={this.closeUploadDocumentationModal}
                    onCancel={this.closeUploadDocumentationModal}
                    onSubmit={this.closeUploadDocumentationModal}
                    visible={this.props.state.navigation.modal['uploadDocumentationModal'] || false}>
                    <View style={styles.modalContainer}>
                        <CustomText
                            style={styles.modalText}>{strings('upload_documentation.incorrect_qrcode')}</CustomText>
                    </View>
                </ModalScreen>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height: '100%',
        width: '100%'
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    topTextContainer: {
        backgroundColor: colors.backgroundColor,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: colors.activeTabColor,
        padding: 10,
        marginTop: 20
    },
    topText: {
        color: colors.activeTabColor
    },
    bottomContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    centerContainer: {
        height: 250,
        width: 250,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        alignSelf: 'center',
        borderColor: colors.activeTabColor,
        backgroundColor: 'transparent',
    },
    pictureButton: {
        backgroundColor: colors.activeTabColor,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderRadius: 40,
        padding: 20,
        marginBottom: 30,
        elevation: 2,
        borderColor: colors.separatorColor
    },
    leftContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    centerRowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    rightContainer: {
        flex: 1
    },
    pictureIcon: {
        fontSize: 25,
        color: colors.backgroundColor
    },
    hiddenButton: {
        display: 'none'
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
    skipButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderRadius: 5,
        padding: 10,
        marginBottom: 30,
        elevation: 2,
        borderColor: colors.activeTabColor
    },
    skipText: {
        fontSize: 18,
        color: colors.activeTabColor,
        textAlign: 'center'
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
)(UploadDocumentation);

