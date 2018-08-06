import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Platform
} from 'react-native';
import colors from '../shared/colors';
import 'moment/locale/da';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import {formatDate} from '../shared/i18n';
import CustomText from './CustomText';
import FastImage from 'react-native-fast-image';

export default class RefundCaseListItem extends Component {

    static propTypes = {
        refundCase: PropTypes.object.isRequired,
        onPress: PropTypes.func
    };

    refundCaseIcon;
    refundCase;

    constructor(props) {
        super(props);

        const dateCreatedFormatted = formatDate(new Date(this.props.refundCase.dateCreated));
        this.state = {
            dateCreatedFormatted: dateCreatedFormatted
        };
    }

    _initProps = () => {
        this.refundCase = this.props.refundCase;

        if (!this.refundCase) return;

        this.refundCaseIcon = this._getRefundCaseIcon(this.refundCase);
    };

    _getRefundCaseIcon = (refundCase) => {
        return <FastImage
            style={styles.documentationIcon}
            resizeMode={FastImage.resizeMode.contain}
            source={{uri: refundCase.merchant.logo}}
        />;
    };

    _handlePress = () => {
        this.props.onPress(this.refundCase);
    };

    render() {
        const {refundCase} = this.props;
        this._initProps();
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.container}
                onPress={this._handlePress}>
                <View style={styles.contentContainer}>
                    <View style={styles.iconContainer}>
                        {this.refundCaseIcon}
                    </View>
                    <View style={styles.detailContentContainer}>
                        <View style={styles.firstDetailsContainer}>
                            <CustomText style={styles.detailSmallText}>{this.state.dateCreatedFormatted}</CustomText>
                            <CustomText style={styles.detailText}>{refundCase.merchant.companyName}</CustomText>
                        </View>
                        <View style={styles.detailsContainer}>
                            <CustomText
                                style={styles.detailBigTitle}>{refundCase.merchant.currency + ' ' + refundCase.refundAmount.toFixed(2).replace(/[.,]00$/, '')}</CustomText>
                            <Icon style={styles.angleRightIcon} name='angle-right'/>
                            <View/>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColor,
        alignSelf: 'center',
        paddingBottom: 10,
        paddingTop: 10,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 2,
        marginBottom: 2,
        elevation: 1,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderColor: Platform.OS === 'ios' ? colors.separatorColor : 0,
        borderRadius: 2
    },
    contentContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5,
        width: '100%'
    },
    detailContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    iconContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.slightlyDarkerColor,
        borderColor: colors.separatorColor,
        borderWidth: 1,
        padding: 5,
        marginRight: 15,
        borderRadius: 40,
        marginLeft: 10,
        marginBottom: 1
    },
    firstDetailsContainer: {
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 2
    },
    detailsContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
    detailBigTitle: {
        fontSize: 18,
        marginRight: 10,
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
    },
    detailText: {
        fontSize: 18,
        color: colors.darkTextColor,
        alignSelf: 'flex-start'
    },
    detailSmallText: {
        fontSize: 10,
        color: colors.darkTextColor,
        alignSelf: 'flex-start',
        textAlign: 'center'
    },
    documentationIcon: {
        height: 40,
        width: 40,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    angleRightIcon: {
        height: undefined,
        width: undefined,
        fontSize: 25,
        color: colors.activeTabColor,
        alignSelf: 'flex-end',
        marginRight: 15
    }
});
