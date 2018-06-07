import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Platform,
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

export default class RefundCaseScreen extends Component {

    static supportedLocales = ['da', 'en'];

    static propTypes = {
        refundCase: PropTypes.object.isRequired,
        onPress: PropTypes.func,
        onIconPress: PropTypes.func,
    };

    refundCaseIcon;
    refundCaseText;
    isHandled;
    refundCase;
    base64Icon;

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
        this.isHandled = this.refundCase.isAccepted || this.refundCase.isRequested || this.refundCase.isRejected;
    };

    _formatDate(date) {
        const locale = I18n.currentLocale();
        const localeFormatted = locale.indexOf("-") === -1 ? locale : locale.substr(0, locale.indexOf('-'));
        return moment(date).locale(RefundCaseScreen.supportedLocales.indexOf(localeFormatted) > -1 ? localeFormatted : 'en').format('LL');
    }

    _getRefundCaseIcon = (refundCase) => {
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
            this.base64Icon = 'data:image/jpg;base64,' + this.refundCase.documentation;
            return (
                <TouchableOpacity onPress={this._handleIconPressed} style={styles.documentationButton}>
                    <Image style={styles.documentationIcon} source={{uri: this.base64Icon}}/>
                </TouchableOpacity>);
        }
        else {
            return <Icon style={[styles.refundCaseIcon, styles.uploadIcon]} name='camera'/>;
        }
    };

    _getRefundCaseText = (refundCase) => {
        const isAccepted = refundCase.isAccepted;
        const isRequested = refundCase.isRequested;
        const isRejected = refundCase.isRejected;
        const documentation = refundCase.documentation;

        if (isAccepted) {
            return <Text style={[styles.bigText, styles.doneIcon]}>{strings('refund_case.approved')}</Text>;
        }
        else if (isRejected) {
            return <Text style={[styles.bigText, styles.rejectedIcon]}>{strings('refund_case.denied')}</Text>;
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

    _handlePress = () => {
        this.props.onPress(this.refundCase);
    };

    _handleIconPressed = () => {
        this.props.onIconPress(this.refundCase);
    };

    render() {
        const {refundCase} = this.props;
        this._initProps();
        return (
            <TouchableOpacity
                disabled={this.isHandled}
                style={styles.container}
                onPress={this._handlePress}>
                <View style={styles.bannerTextContainer}>
                    <View style={styles.bannerTextBarContainer}>
                        <Text style={styles.headlineText}>{refundCase.merchant.companyName}</Text>
                        <Text style={styles.headlineText}>{this.state.dateCreatedFormatted}</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.iconContainer}>
                        {this.refundCaseIcon}
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
                    <View style={styles.endContentContainer}>
                        {this.refundCaseText}
                    </View>
                    {!this.isHandled &&
                    <View style={styles.detailsContainer}>
                        <Icon style={styles.angleRightIcon} name='angle-right'/>
                    </View>
                    }
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
        marginLeft: 45,
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 3,
        opacity: 0.8,
        backgroundColor: colors.activeTabColor,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
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
        fontSize: 15,
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
        marginRight: 10
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
        fontWeight: 'bold',
        color: colors.darkTextColor
    },
    detailText: {
        fontSize: 12,
        color: colors.darkTextColor
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
        marginRight: 10,
        borderRadius: 20
    },
    documentationButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadIcon: {
        color: colors.activeTabColor
    },
    angleRightIcon: {
        height: undefined,
        width: undefined,
        fontSize: 25,
        marginLeft: 5,
        color: colors.activeTabColor
    }
});
