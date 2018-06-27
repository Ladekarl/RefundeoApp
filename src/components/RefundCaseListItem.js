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
import {formatDate, strings} from '../shared/i18n';

export default class RefundCaseListItem extends Component {

    static propTypes = {
        refundCase: PropTypes.object.isRequired,
        onPress: PropTypes.func,
        onIconPress: PropTypes.func,
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
        return <Image style={styles.documentationIcon} resizeMode='contain'
                      source={{uri: 'data:image/png;base64,' + refundCase.merchant.logo}}/>;
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
                            <Text style={styles.detailSmallText}>{this.state.dateCreatedFormatted}</Text>
                            <Text style={styles.detailText}>{refundCase.merchant.companyName}</Text>
                        </View>
                        <View style={styles.detailsContainer}>
                            <Text
                                style={styles.detailBigTitle}>{refundCase.refundAmount.toFixed(2).replace(/[.,]00$/, '')}</Text>
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
        backgroundColor: 'transparent',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    contentContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
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
        marginLeft: 15
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
        margin: 10,
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
        margin: 10
    },
    rowContainer: {
        flex: 1
    },
});
