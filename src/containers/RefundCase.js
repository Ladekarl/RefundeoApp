import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, ImageBackground, Image, Platform, TouchableOpacity} from 'react-native';
import {strings} from '../shared/i18n';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import ModalScreen from '../components/Modal';

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
        if ((!refundCase.tempReceiptImage || !refundCase.tempVatFormImage) && !refundCase.vatFormImage && !refundCase.receiptImage) {
            this.openRefundCaseModal();
        } else if (refundCase.tempReceiptImage && refundCase.tempVatFormImage && !refundCase.vatFormImage && !refundCase.receiptImage) {
            this.props.actions.uploadDocumentation(refundCase, refundCase.tempVatFormImage, refundCase.tempReceiptImage);
        }
    };

    openRefundCaseModal = () => {
        this.props.actions.openModal('refundCaseModal');
    };

    closeRefundCaseModal = () => {
        this.props.actions.closeModal('refundCaseModal');
    };

    onUploadVatPress = () => {
        this.props.actions.selectUploadDocumentation('vatFormImage');
    };

    onUploadReceiptPress = () => {
        this.props.actions.selectUploadDocumentation('receiptImage');
    };

    render() {
        const {state} = this.props;
        const {navigation, selectedRefundCase} = state;
        const refundCase = selectedRefundCase;
        const {merchant} = refundCase;

        const receiptImage = this.getReceiptImage(refundCase);
        const vatImage = this.getVatImage(refundCase);

        return (
            <View style={styles.container}>
                <ScrollView styles={styles.scrollContainer}>
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
                    <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadVatPress}>
                        <View style={styles.uploadImageContainer}>
                            <Image style={styles.uploadImage} resizeMode='contain'
                                   source={vatImage}/>
                        </View>
                        <Text style={styles.buttonText}>Upload VAT form</Text>
                        <Icon style={styles.angleRightIcon} name='angle-right'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.descriptionContainer} onPress={this.onUploadReceiptPress}>
                        <View style={styles.uploadImageContainer}>
                            <Image style={styles.uploadImage} resizeMode='contain'
                                   source={receiptImage}/>
                        </View>
                        <Text style={styles.buttonText}>Upload receipt</Text>
                        <Icon style={styles.angleRightIcon} name='angle-right'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={this.onRequestRefundPress}>
                        <Text style={styles.submitButtonText}>Request Refund</Text>
                    </TouchableOpacity>
                </ScrollView>
                <ModalScreen
                    modalTitle={'Not yet'}
                    onBack={this.closeRefundCaseModal}
                    onCancel={this.closeRefundCaseModal}
                    onSubmit={this.closeRefundCaseModal}
                    visible={navigation.modal['refundCaseModal'] || false}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Please upload stamped VAT form and receipt before requesting
                            refund.</Text>
                    </View>
                </ModalScreen>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.slightlyDarkerColor,
    },
    scrollContainer: {
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
)(RefundCase);