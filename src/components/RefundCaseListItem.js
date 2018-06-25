import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import colors from '../shared/colors';
import moment from 'moment';
import 'moment/locale/da';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import {strings} from '../shared/i18n';

export default class RefundCaseListItem extends Component {

    static supportedLocales = ['da', 'en'];

    static propTypes = {
        refundCase: PropTypes.object.isRequired,
        onPress: PropTypes.func,
        onIconPress: PropTypes.func,
    };

    refundCaseIcon;
    refundCaseText;
    refundCase;

    constructor(props) {
        super(props);

        const dateCreatedFormatted = this._formatDate(new Date(this.props.refundCase.dateCreated));
        this.state = {
            dateCreatedFormatted: dateCreatedFormatted
        };
    }

    _initProps = () => {
        this.refundCase = this.props.refundCase;

        if (!this.refundCase) return;

        this.refundCaseIcon = this._getRefundCaseIcon(this.refundCase);
        this.refundCaseText = this._getRefundCaseText(this.refundCase);
    };

    _formatDate(date) {
        const locale = I18n.currentLocale();
        const localeFormatted = locale.indexOf('-') === -1 ? locale : locale.substr(0, locale.indexOf('-'));
        return moment(date).locale(RefundCaseListItem.supportedLocales.indexOf(localeFormatted) > -1 ? localeFormatted : 'en').format('LL');
    }

    _getRefundCaseIcon = (refundCase) => {
        return <Image style={styles.documentationIcon} resizeMode='contain'
                      source={{uri: 'data:image/png;base64,' + refundCase.merchant.logo}}/>;
    };

    _getRefundCaseText = (refundCase) => {
        const isAccepted = refundCase.isAccepted;
        const isRequested = refundCase.isRequested;
        const isRejected = refundCase.isRejected;
        const hasTempImages = refundCase.tempReceiptImage && refundCase.tempVatFormImage;
        const hasImages = refundCase.receiptImage && refundCase.vatFormImage;

        if (isAccepted) {
            return <Text style={[styles.bigText, styles.doneIcon]}>{strings('refund_case.approved')}</Text>;
        }
        else if (isRejected) {
            return <Text style={[styles.bigText, styles.rejectedIcon]}>{strings('refund_case.denied')}</Text>;
        }
        else if (isRequested) {
            return <Text style={styles.bigText}>{strings('refund_case.pending_approval')}</Text>;
        }
        else if (hasTempImages || hasImages) {
            return <Text style={styles.bigText}>{strings('refund_case.send_documentation')}</Text>;
        }
        else {
            return <Text style={styles.bigText}>{strings('refund_case.upload_documentation')}</Text>;
        }
    };

    _handlePress = () => {
        this.props.onPress(this.refundCase);
    };

    getBannerColor = (refundCase) => {
        const isAccepted = refundCase.isAccepted;
        const isRejected = refundCase.isRejected;

        if (isAccepted) return colors.greenButtonColor;
        if (isRejected) return colors.cancelButtonColor;
        return colors.activeTabColor;
    };

    render() {
        const {refundCase} = this.props;
        this._initProps();
        const bannerColor = this.getBannerColor(refundCase);
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this._handlePress}>
                <View style={styles.bannerTextContainer}>
                    <View style={[styles.bannerTextBarContainer, {backgroundColor: bannerColor}]}>
                        <Text
                            style={styles.headlineText}>{refundCase.merchant.companyName + ' - ' + refundCase.merchant.addressCity}</Text>
                        <Text style={styles.headlineText}>{this.state.dateCreatedFormatted}</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.iconContainer}>
                        {this.refundCaseIcon}
                    </View>
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailTitle}>{strings('refund_case.receipt_number')}</Text>
                            <Text style={styles.detailText}>{refundCase.receiptNumber}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailTitle}>{strings('refund_case.amount')}</Text>
                            <Text style={styles.detailText}>{refundCase.amount}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailTitle}>{strings('refund_case.refund_amount')}</Text>
                            <Text style={styles.detailText}>{refundCase.refundAmount.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View style={styles.endContentContainer}>
                        {this.refundCaseText}
                    </View>
                    <View style={styles.detailsContainer}>
                        <Icon style={styles.angleRightIcon} name='angle-right'/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: 'transparent',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        alignSelf: 'center',
    },
    bannerTextContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: colors.activeTabColor,
        padding: 10
    },
    headlineText: {
        fontSize: 18,
        maxWidth: '70%',
        color: colors.backgroundColor,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        width: '100%'
    },
    endContentContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignSelf: 'center',
        marginRight: 5,
        flex: 1
    },
    bigText: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'right',
        color: colors.activeTabColor
    },
    iconContainer: {
        width: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    detailsContainer: {
        justifyContent: 'center',
        alignItems: 'stretch',
        marginRight: 5
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 5,
        marginBottom: 5
    },
    detailTitle: {
        fontSize: 11,
        marginRight: 5,
        fontWeight: 'bold',
        color: colors.darkTextColor
    },
    detailText: {
        fontSize: 12,
        color: colors.darkTextColor
    },
    doneIcon: {
        color: colors.greenButtonColor
    },
    rejectedIcon: {
        color: colors.cancelButtonColor
    },
    documentationIcon: {
        height: 40,
        width: 40,
        marginRight: 10,
        borderRadius: 20
    },
    angleRightIcon: {
        height: undefined,
        width: undefined,
        fontSize: 25,
        marginLeft: 5,
        color: colors.activeTabColor
    }
});
