import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard,
    RefreshControl
} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import ModalScreen from '../components/Modal';
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';

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
        state: PropTypes.object.isRequired,
        noPassword: PropTypes.bool
    };

    modalTextInput;
    secondTextInput;
    thirdTextInput;

    constructor(props) {
        super(props);
        const userCountryData = getAllCountries()
            .filter(country => country.name.common === this.props.state.user.country)
            .pop();
        let callingCode = '';
        let cca2 = '';
        if (userCountryData) {
            cca2 = userCountryData.cca2;
        }
        if (cca2 && userCountryData) {
            callingCode = userCountryData.callingCode;
        }

        this.state = {
            modalTitle: '',
            modalValue: '',
            newPasswordValue: '',
            confPasswordValue: '',
            propToChange: '',
            modalInputError: '',
            modalInputType: 'default',
            modalShowInput: false,
            isChangePassword: false,
            cca2,
            callingCode
        };
    }

    componentWillUnmount() {
        this.closeModal();
    }

    showChangeFirstName = () => {
        this.setModalState(strings('settings.first_name_title'), this.props.state.user.firstName, true, strings('settings.first_name_placeholder'), 'firstName');
    };

    showChangeLastName = () => {
        this.setModalState(strings('settings.last_name_title'), this.props.state.user.lastName, true, strings('settings.last_name_placeholder'), 'lastName');
    };

    showChangeBankReg = () => {
        this.setModalState(strings('settings.bank_reg_title'), this.props.state.user.bankRegNumber, true, strings('settings.bank_reg_placeholder'), 'bankRegNumber', 'phone-pad');
    };

    showChangeBankAccount = () => {
        this.setModalState(strings('settings.bank_account_title'), this.props.state.user.bankAccountNumber, true, strings('settings.bank_account_placeholder'), 'bankAccountNumber', 'phone-pad');
    };

    showChangePassword = () => {
        this.setModalState(strings('settings.change_password_title'), '', true, strings('settings.change_password_placeholder'), '', 'default', true);
        this.submitFunction = () => {
            let oldPassword = this.state.modalValue;
            let newPassword = this.state.newPasswordValue;
            let confPassword = this.state.confPasswordValue;
            if (oldPassword && newPassword && confPassword && newPassword === confPassword) {
                // noinspection EqualityComparisonWithCoercionJS
                const hasLowerCase = newPassword.toUpperCase() != newPassword;
                const uniqueChars = String.prototype.concat(...new Set(newPassword)).length;
                if (hasLowerCase && newPassword.length >= 8 && uniqueChars >= 4) {
                    this.closeModal();
                    this.props.actions.changePassword(oldPassword, newPassword, confPassword);
                }
                else if (newPassword.length < 8) {
                    this.setState({modalInputError: strings('settings.error_password_too_short')});
                }
                else if (uniqueChars < 4) {
                    this.setState({modalInputError: strings('settings.error_password_not_unique')});
                }
                else if (!hasLowerCase) {
                    this.setState({modalInputError: strings('settings.error_password_only_uppercase')});
                }
            } else if (!oldPassword || !newPassword || !confPassword) {
                this.setState({modalInputError: strings('settings.error_password_not_filled')});
            } else {
                this.setState({modalInputError: strings('settings.error_password_not_same')});
            }
        };
    };

    showSignOut = () => {
        this.setModalState(strings('settings.sign_out_title'));
        this.submitFunction = () => {
            this.closeModal();
            this.props.actions.logout();
        };
    };

    closeModal = () => {
        return this.props.actions.closeModal('settingsModal');
    };

    changeModalValue = (text) => {
        this.setState({
            modalValue: text
        });
    };

    changeNewPasswordValue = (text) => {
        this.setState({
            newPasswordValue: text
        });
    };

    changeConfPasswordValue = (text) => {
        this.setState({
            confPasswordValue: text
        });
    };

    setModalState(title, value = '', showInput = false, placeholder = '', propToChange = '', modalInputType = 'default', isChangePassword = false) {
        this.setState({
            modalTitle: title,
            modalValue: value,
            modalShowInput: showInput,
            modalPlaceholder: placeholder,
            modalInputType,
            isChangePassword,
            propToChange,
            modalInputError: ''
        });

        if (showInput && this.modalTextInput) {
            this.modalTextInput.focus();
        }

        this.props.actions.openModal('settingsModal');

        this.submitFunction = this.defaultSubmitFunction;
    }

    countryChanged = (value) => {
        this.setState({
            cca2: value.cca2,
            callingCode: value.callingCode
        });

        let user = this.props.state.user;
        user.country = value.name;
        this.props.actions.changeUser(user);
    };

    defaultSubmitFunction = () => {
        const modalValue = this.state.modalValue;
        if (!modalValue) {
            this.setState({modalInputError: strings('settings.error_password_not_filled')});
            return;
        }
        let user = this.props.state.user;
        user[this.state.propToChange] = modalValue;
        this.props.actions.changeUser(user);

        this.closeModal();
    };

    submitFunction = () => {
    };

    focusSecondTextInput = () => {
        if (this.secondTextInput) {
            this.secondTextInput.focus();
        } else {
            Keyboard.dismiss();
        }
    };

    focusThirdTextInput = () => {
        if (this.thirdTextInput) {
            this.thirdTextInput.focus();
        }
    };

    render() {
        const {state, actions, noPassword} = this.props;

        return (
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps={'always'}
                refreshControl={
                    <RefreshControl
                        tintColor={colors.activeTabColor}
                        refreshing={state.fetching}
                        onRefresh={actions.getUser}
                    />
                }>
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
                <View style={styles.countryContainer}>
                    <CountryPicker
                        onChange={this.countryChanged}
                        cca2={this.state.cca2}
                        translation='eng'
                        closeable={true}
                        filterable={true}>
                        <View style={styles.countryRowContainer}>
                            <Text style={styles.leftText}>{strings('settings.country')}</Text>
                            <Text style={styles.rightText}>{state.user.country}</Text>
                        </View>
                    </CountryPicker>
                </View>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangeBankReg}>
                    <Text style={styles.leftText}>{strings('settings.bank_reg')}</Text>
                    <Text style={styles.rightText}>{state.user.bankRegNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangeBankAccount}>
                    <Text style={styles.leftText}>{strings('settings.bank_account')}</Text>
                    <Text style={styles.rightText}>{state.user.bankAccountNumber}</Text>
                </TouchableOpacity>
                {!noPassword && !state.user.isOauth &&
                <TouchableOpacity style={styles.rowContainer} onPress={this.showChangePassword}>
                    <Text style={styles.leftButtonText}>{strings('settings.change_password')}</Text>
                </TouchableOpacity>
                }
                <TouchableOpacity style={styles.rowContainer} onPress={this.showSignOut}>
                    <Text style={styles.leftRedText}>{strings('settings.sign_out')}</Text>
                </TouchableOpacity>
                <ModalScreen
                    modalTitle={this.state.modalTitle}
                    visible={state.navigation.modal['settingsModal'] || false}
                    onCancel={this.closeModal}
                    noChildren={!this.state.modalShowInput}
                    onSubmit={this.submitFunction}
                    onBack={this.closeModal}>
                    <View style={styles.modalContainer}>
                        <TextInput
                            ref={(input) => this.modalTextInput = input}
                            style={styles.modalInput}
                            value={this.state.modalValue}
                            secureTextEntry={this.state.isChangePassword}
                            onChangeText={this.changeModalValue}
                            autoFocus={true}
                            maxLength={64}
                            placeholder={this.state.modalPlaceholder}
                            selectionColor={colors.inactiveTabColor}
                            underlineColorAndroid={colors.activeTabColor}
                            tintColor={colors.activeTabColor}
                            numberOfLines={1}
                            keyboardType={this.state.modalInputType}
                            editable={true}
                            returnKeyType={this.state.isChangePassword ? 'next' : 'done'}
                            autoCapitalize={this.state.isChangePassword ? 'none' : 'words'}
                            autoCorrect={!this.state.isChangePassword}
                            onSubmitEditing={this.focusSecondTextInput}
                            blurOnSubmit={false}
                        />
                        {this.state.isChangePassword &&
                        <TextInput
                            ref={(input) => this.secondTextInput = input}
                            style={styles.modalInput}
                            value={this.state.change}
                            maxLength={64}
                            onChangeText={this.changeNewPasswordValue}
                            placeholder={strings('settings.change_password_new_password_placeholder')}
                            selectionColor={colors.inactiveTabColor}
                            secureTextEntry={true}
                            autoCapitalize={'none'}
                            underlineColorAndroid={colors.activeTabColor}
                            tintColor={colors.activeTabColor}
                            numberOfLines={1}
                            keyboardType={this.state.modalInputType}
                            autoCorrect={false}
                            editable={true}
                            returnKeyType={'next'}
                            onSubmitEditing={this.focusThirdTextInput}
                        />
                        }
                        {this.state.isChangePassword &&
                        <TextInput
                            ref={(input) => this.thirdTextInput = input}
                            style={styles.modalInput}
                            value={this.state.change}
                            maxLength={64}
                            onChangeText={this.changeConfPasswordValue}
                            placeholder={strings('settings.change_password_conf_password_placeholder')}
                            selectionColor={colors.inactiveTabColor}
                            secureTextEntry={true}
                            keyboardType={this.state.modalInputType}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={colors.activeTabColor}
                            tintColor={colors.activeTabColor}
                            numberOfLines={1}
                            editable={true}
                        />
                        }
                        <Text style={styles.modalInputErrorText}>{this.state.modalInputError}</Text>
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
    countryContainer: {
        marginBottom: 10,
        marginTop: 10,
    },
    countryRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    sectionHeaderContainer: {
        backgroundColor: colors.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 15 : 20,
        marginBottom: 5,
        marginLeft: 15
    },
    leftText: {
        marginLeft: 10
    },
    leftButtonText: {
        marginLeft: 10,
        color: colors.submitButtonColor
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
        textAlign: 'center',
        minWidth: '80%',
        fontSize: 15,
        marginTop: Platform.OS === 'ios' ? 10 : 0
    },
    modalInputErrorText: {
        textAlign: 'center',
        color: colors.cancelButtonColor
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
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