import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';

class SettingsScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        title: strings('settings.settings'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {state} = this.props;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderText}>{strings('settings.profile')}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>{strings('settings.name')}</Text>
                    <Text style={styles.rightText}>{`${state.user.firstName} ${state.user.lastName}`}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>{strings('settings.email')}</Text>
                    <Text style={styles.rightText}>{state.user.username}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>{strings('settings.country')}</Text>
                    <Text style={styles.rightText}>{state.user.country}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>{strings('settings.bank_reg')}</Text>
                    <Text style={styles.rightText}>{state.user.bankRegNumber}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>{strings('settings.bank_account')}</Text>
                    <Text style={styles.rightText}>{state.user.bankAccountNumber}</Text>
                </View>
                <View style={styles.changePasswordRowContainer}>
                    <TouchableOpacity
                        style={styles.changePasswordButton}
                        onPress={() => {
                        }}>
                        <Text style={styles.changePasswordText}>{strings('settings.change_password')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
        marginTop: 2,
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    sectionHeaderContainer: {
        backgroundColor: colors.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15
    },
    changePasswordRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 7,
        padding: 15,
    },
    changePasswordButton: {
        backgroundColor: colors.cancelButtonColor,
        padding: 15,
        borderRadius: 30,
        elevation: 5
    },
    changePasswordText: {
        fontSize: 18,
        color: colors.whiteColor
    },
    leftText: {
        marginLeft: 10
    },
    sectionHeaderText: {
        fontSize: 18,
        marginLeft: 10
    },
    rightText: {
        marginRight: 10,
        color: colors.submitButtonColor
    }
});

const mapStateToProps = state => {
    return {
        state: {
            ...state.authReducer
        }
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsScreen);