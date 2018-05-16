import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import {strings} from '../shared/i18n';

export default class RefundCaseScreen extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        refundCase: PropTypes.object.isRequired
    };

    navigateScanner = () => {
        this.props.actions.navigateScanner();
    };

    render() {
        const {actions, refundCase} = this.props;
        return (
            <View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>Amount</Text>
                    <Text style={styles.rightText}>{refundCase.amount}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>Is accepted</Text>
                    <Text style={styles.rightText}>{refundCase.isAccepted}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>Is requested</Text>
                    <Text style={styles.rightText}>{refundCase.isRequested}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>Refund amount</Text>
                    <Text style={styles.rightText}>{refundCase.refundAmount}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
        marginTop: 2,
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    leftText: {
        marginLeft: 10
    },
    rightText: {
        marginRight: 10,
        color: colors.submitButtonColor
    }
});

