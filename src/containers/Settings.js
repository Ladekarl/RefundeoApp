import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import ModalScreen from '../components/Modal';

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

    modalTextInput;

    constructor(props) {
        super(props);
        this.state = {
            modalTitle: '',
            modalVisible: false,
            modalValue: '',
            modalShowInput: false,
            modalTextValue: ''
        };
    }

    showChangeFirstName = () => {
        this.setModalState('Change first name', true, this.props.state.user.firstName, true);
        this.submitFunction = () => {
            this.props.actions.changeFirstName(this.state.modalTextValue);
        }
    };

    showChangeLastName = () => {
        this.setModalState('Change last name', true, this.props.state.user.lastName, true, strings('settings.last_name'));
        this.submitFunction = () => {
            this.props.actions.changeLastName(this.state.modalTextValue);
        }
    };

    showChangeCountry = () => {
        this.setModalState('Change country', true, this.props.state.user.country, true, strings('settings.first_name'));
        this.submitFunction = () => {
            this.props.actions.changeCountry(this.state.modalTextValue);
        }
    };

    showChangeBankReg = () => {
        this.setModalState('Change bank registration number', true, this.props.state.user.bankRegNumber, true, strings('settings.bank_reg'));
        this.submitFunction = () => {
            this.props.actions.changeRegNumber(this.state.modalTextValue);
        }
    };

    showChangeBankAccount = () => {
        this.setModalState('Change bank account', true, this.props.state.user.bankAccountNumber, true, strings('settings.bank_account'));
        this.submitFunction = () => {
            this.props.actions.changeAccountNumber(this.state.modalTextValue);
        }
    };

    showChangePassword = () => {
        this.setModalState('Change password', true, '', false, '');
        this.submitFunction = () => {
            this.props.actions.changePassword(this.state.modalTextValue);
        }
    };

    showSignOut = () => {
        this.setModalState('Are you sure you wish to sign out?', true, '', false, '');
        this.submitFunction = () => {
            this.props.actions.logout();
        }
    };

    closeModal = () => {
        this.setState({
            modalVisible: false
        });
    };

    changeModalTextValue = (text) => {
        this.setState({
            modalTextValue: text
        });
    };

    setModalState(title, visible, value, showInput, placeholder) {
        this.setState({
            modalTitle: title,
            modalVisible: visible,
            modalValue: value,
            modalShowInput: showInput,
            modalPlaceholder: placeholder
        });
        if (showInput && this.modalTextInput) {
            this.modalTextInput.focus();
        }
    }

    submitFunction = () => {};

    render() {
        const {state} = this.props;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderText}>{strings('settings.profile')}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.leftText}>{strings('settings.email')}</Text>
                    <Text style={styles.rightText}>{state.user.username}</Text>
                </View>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangeFirstName}>
                    <Text style={styles.leftText}>{strings('settings.first_name')}</Text>
                    <Text style={styles.rightText}>{state.user.firstName}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangeLastName}>
                    <Text style={styles.leftText}>{strings('settings.last_name')}</Text>
                    <Text style={styles.rightText}>{state.user.lastName}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangeCountry}>
                    <Text style={styles.leftText}>{strings('settings.country')}</Text>
                    <Text style={styles.rightText}>{state.user.country}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangeBankReg}>
                    <Text style={styles.leftText}>{strings('settings.bank_reg')}</Text>
                    <Text style={styles.rightText}>{state.user.bankRegNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangeBankAccount}>
                    <Text style={styles.leftText}>{strings('settings.bank_account')}</Text>
                    <Text style={styles.rightText}>{state.user.bankAccountNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangePassword}>
                    <Text style={styles.leftText}>{strings('settings.change_password')}</Text>
                    <Text style={styles.rightText}>{state.user.bankAccountNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showSignOut}>
                    <Text style={styles.leftRedText}>Sign out</Text>
                    <Text style={styles.rightText}>{state.user.bankAccountNumber}</Text>
                </TouchableOpacity>
                <ModalScreen
                    modalTitle={this.state.modalTitle}
                    visible={this.state.modalVisible}
                    onCancel={this.closeModal}
                    noChildren={!this.state.modalShowInput}
                    onSubmit={this.submitFunction}
                    onBack={this.closeModal}>
                    <View style={styles.modalContainer}>
                        <TextInput
                            ref={this.modalTextInput}
                            style={styles.modalInput}
                            value={this.state.modalValue}
                            onChangeText={this.changeModalTextValue}
                            placeholder={this.state.modalPlaceholder}
                            numberOfLines={1}
                            editable={true}
                        />
                    </View>
                </ModalScreen>
            </ScrollView>
        );
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
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    sectionHeaderContainer: {
        backgroundColor: colors.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 15
    },
    leftText: {
        marginLeft: 10
    },
    leftRedText: {
        marginLeft: 10,
        color: colors.cancelButtonColor
    },
    sectionHeaderText: {
        fontSize: 18,
        marginLeft: 10,
        textAlign: 'center'
    },
    rightText: {
        marginRight: 10,
        color: colors.submitButtonColor
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    modalInput: {
        fontSize: 18
    }
});

const mapStateToProps = state => {
    return {
        state: {
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
)(SettingsScreen);