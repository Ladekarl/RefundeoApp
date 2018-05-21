import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Platform,
    TouchableOpacity,
    ImageBackground, Image
} from 'react-native';
import colors from '../shared/colors';
import moment from 'moment';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import ImagePicker from 'react-native-image-picker';
import {strings} from '../shared/i18n';

export default class RefundCaseScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        refundCase: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            dateCreatedFormatted: ''
        };
    }

    componentWillMount() {
        const dateCreatedFormatted = this._formatDate(new Date(this.props.refundCase.dateCreated));
        this.setState({
            dateCreatedFormatted
        });
    }

    _formatDate(date) {
        const locale = I18n.currentLocale();
        return moment(date).locale(locale).format('LL');
    }

    getRefundCaseIcon = (refundCase) => {
        const isAccepted = refundCase.isAccepted;
        const isRequested = refundCase.isRequested;
        const isRejected = refundCase.isRejected;
        const documentation = refundCase.documentation;

        if (isAccepted) {
            return <Icon style={[styles.refundCaseIcon, styles.doneIcon]} name='check'/>;
        }
        else if (isRejected) {
            return <Icon style={[styles.refundCaseIcon, styles.rejectedIcon]} name='times'/>;
        }
        else if (isRequested) {
            return <Icon style={[styles.refundCaseIcon, styles.pendingIcon]} name='spinner'/>;
        }
        else if (documentation) {
            const base64Icon = 'data:image/jpg;base64,' + documentation;
            return (
                <TouchableOpacity onPress={this._showImagePicker}>
                    <Image style={styles.documentationIcon} source={{uri: base64Icon}}/>
                </TouchableOpacity>);
        }
        else {
            return <Icon style={[styles.refundCaseIcon, styles.uploadIcon]} name='camera'/>;
        }
    };

    getRefundCaseText = (refundCase) => {
        const isAccepted = refundCase.isAccepted;
        const isRequested = refundCase.isRequested;
        const isRejected = refundCase.isRejected;
        const documentation = refundCase.documentation;

        if (isAccepted) {
            return <Text style={styles.bigText}>{strings('refund_case.approved')}</Text>;
        }
        else if (isRejected) {
            return <Text style={styles.bigText}>{strings('refund_case.denied')}</Text>;
        }
        else if (isRequested) {
            return <Text style={styles.bigText}>{strings('refund_case.pending_approval')}</Text>;
        }
        else if (documentation) {
            return <Text style={styles.bigText}>{strings('refund_case.send_documentation')}</Text>;
        }
        else {
            return <Text style={styles.bigText}>{strings('refund_case.upload_documentation')}</Text>;
        }
    };

    _showImagePicker = () => {
        const options = {
            title: strings('refund_case.choose_photo'),
            mediaType: 'photo',
            quality: 0.3,
            noData: true,
            storageOption: {
                skipBackup: true
            },
            permissionDenied: {
                reTryTitle: strings('refund_case.permission_try_again'),
                okTitle: strings('refund_case.permission_ok'),
                title: strings('refund_case.permission_title'),
                text: strings('refund_case.permission_text')
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (!response.error && !response.didCancel) {
                const photoPath = response.uri;
                const uploadUri = Platform.OS === 'ios' ? photoPath.replace('file://', '') : photoPath;
                this.props.actions.uploadDocumentation(this.props.refundCase, uploadUri);
            }
        });
    };


    onRefundCasePress = () => {
        const refundCase = this.props.refundCase;
        if (!refundCase) return;
        const isAccepted = refundCase.isAccepted;
        const isRequested = refundCase.isRequested;
        const isRejected = refundCase.isRejected;
        const documentation = refundCase.documentation;

        if (isAccepted || isRequested || isRejected) return;

        if (documentation) {
            return this.props.actions.requestRefund(refundCase);
        }
        else {
            this._showImagePicker();
        }
    };

    render() {
        const {refundCase} = this.props;

        const refundCaseIcon = this.getRefundCaseIcon(refundCase);
        const refundCaseText = this.getRefundCaseText(refundCase);

        return (
            <TouchableOpacity
                disabled={refundCase.isAccepted || refundCase.isRequested || refundCase.isRejected}
                style={styles.container}
                onPress={this.onRefundCasePress}>
                <ImageBackground
                    style={styles.bannerImage}
                    source={require('../../assets/images/refundeo_logo.png')}
                    borderRadius={2}>
                    <View style={styles.bannerTextContainer}>
                        <View style={styles.bannerTextBarContainer}>
                            <Text style={styles.headlineText}>{refundCase.merchant.companyName}</Text>
                            <Text style={styles.headlineText}>{this.state.dateCreatedFormatted}</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.contentContainer}>
                    <View style={styles.detailsContainer}>
                        {refundCaseIcon}
                    </View>
                    <View style={styles.centerContentContainer}>
                        {refundCaseText}
                    </View>
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailTitle}>{strings('refund_case.amount')}</Text>
                            <Text style={styles.detailText}>{refundCase.amount}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailTitle}>{strings('refund_case.refund_amount')}</Text>
                            <Text style={styles.detailText}>{refundCase.refundAmount}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        backgroundColor: colors.backgroundColor,
        borderRadius: 3,
        elevation: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        alignSelf: 'center',
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0
    },
    bannerImage: {
        width: '100%',
        borderRadius: 50,
        height: 50
    },
    bannerTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 3,
        opacity: 0.8,
        backgroundColor: colors.activeTabColor,
        paddingLeft: 10,
        paddingRight: 10
    },
    headlineText: {
        fontSize: 15,
        color: colors.backgroundColor,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 10
    },
    centerContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        flex: 1,
        marginLeft: 5,
        marginRight: 5
    },
    bigText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    detailsContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 5,
        marginBottom: 5
    },
    detailTitle: {
        fontSize: 12,
        marginRight: 5,
        fontWeight: 'bold'
    },
    detailText: {
        fontSize: 12
    },
    refundCaseIcon: {
        height: undefined,
        width: undefined,
        fontSize: 25,
        marginRight: 10
    },
    doneIcon: {
        color: colors.greenButtonColor
    },
    rejectedIcon: {
        color: colors.cancelButtonColor
    },
    pendingIcon: {
        color: colors.activeTabColor
    },
    documentationIcon: {
        height: 40,
        width: 40,
        marginRight: 10
    },
    uploadIcon: {
        color: colors.activeTabColor
    }
});
