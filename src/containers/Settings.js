import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Switch,
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
import Icon from 'react-native-fa-icons';
import Setting from '../components/Setting';
import Validation from '../shared/Validation';

class SettingsScreen extends Component {

    static navigationOptions = {
        title: strings('settings.settings'),
        headerTitleStyle: {
            fontSize: 18
        },
        tabBarIcon: ({tintColor}) => (
            <Icon name='user-circle' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired,
        requiredOnly: PropTypes.bool
    };

    modalTextInput;
    secondTextInput;
    thirdTextInput;


    termsOfService = strings('register.terms_of_service');
    privacyPolicy = strings('register.privacy_policy');

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

    showChangeEmail = () => {
        this.setModalState(strings('settings.email_title'), this.props.state.user.email, true, strings('settings.email_placeholder'), 'email', 'email-address');
        this.submitFunction = () => {
            let email = this.state.modalValue;
            if (email && !Validation.validateEmail(email)) {
                this.setState({modalInputError: strings('settings.error_not_email')});
            } else {
                this.defaultSubmitFunction();
            }
        };
    };

    showChangeFirstName = () => {
        this.setModalState(strings('settings.first_name_title'), this.props.state.user.firstName, true, strings('settings.first_name_placeholder'), 'firstName');
    };

    showChangeLastName = () => {
        this.setModalState(strings('settings.last_name_title'), this.props.state.user.lastName, true, strings('settings.last_name_placeholder'), 'lastName');
    };

    showSwiftModal = () => {
        this.setModalState(strings('settings.swift_title'), this.props.state.user.swift, true, strings('settings.swift_placeholder'), 'swift');
    };

    showAccountNumberModal = () => {
        this.setModalState(strings('settings.account_number_title'), this.props.state.user.accountNumber, true, strings('settings.account_number_placeholder'), 'accountNumber', 'phone-pad');
    };

    showStreetNameModal = () => {
        this.setModalState(strings('settings.address_street_name_title'), this.props.state.user.addressStreetName, true, strings('settings.address_street_name_placeholder'), 'addressStreetName');
    };

    showStreetNumberModal = () => {
        this.setModalState(strings('settings.address_street_number_title'), this.props.state.user.addressStreetNumber, true, strings('settings.address_street_number_placeholder'), 'addressStreetNumber');
    };

    showPostalCodeModal = () => {
        this.setModalState(strings('settings.address_postal_code_title'), this.props.state.user.addressPostalCode, true, strings('settings.address_postal_code_placeholder'), 'addressPostalCode');
    };

    showCityModal = () => {
        this.setModalState(strings('settings.address_city_title'), this.props.state.user.addressCity, true, strings('settings.address_city_placeholder'), 'addressCity');
    };

    showCountryModal = () => {
        this.setModalState(strings('settings.address_country_title'), this.props.state.user.addressCountry, true, strings('settings.address_country_placeholder'), 'addressCountry');
    };

    showPassportModal = () => {
        this.setModalState(strings('settings.passport_title'), this.props.state.user.passport, true, strings('settings.passport_placeholder'), 'passport');
    };

    showChangePassword = () => {
        this.setModalState(strings('settings.change_password_title'), '', true, strings('settings.change_password_placeholder'), '', 'default', true);
        this.submitFunction = () => {
            let oldPassword = this.state.modalValue;
            let newPassword = this.state.newPasswordValue;
            let confPassword = this.state.confPasswordValue;
            if (oldPassword && newPassword && confPassword && newPassword === confPassword) {
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
            this.setState({modalInputError: strings('settings.error_fields_empty')});
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

    acceptTermsOfService = (isAccepted) => {
        let user = this.props.state.user;
        user.acceptedTermsOfService = isAccepted;
        user.termsOfService = this.termsOfService;
        this.props.actions.changeUser(user);
    };

    acceptPrivacyPolicy = (isAccepted) => {
        let user = this.props.state.user;
        user.acceptedPrivacyPolicy = isAccepted;
        user.privacyPolicy = this.privacyPolicy;
        this.props.actions.changeUser(user);
    };

    closeTermsOfServiceModal = () => {
        return this.props.actions.closeModal('termsOfServiceModal');
    };

    openTermsOfServiceModal = () => {
        return this.props.actions.openModal('termsOfServiceModal');
    };

    closePrivacyPolicyModal = () => {
        return this.props.actions.closeModal('privacyPolicyModal');
    };

    openPrivacyPolicyModal = () => {
        return this.props.actions.openModal('privacyPolicyModal');
    };

    render() {
        const {state, actions, requiredOnly} = this.props;

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
                <View style={[styles.sectionHeaderContainer, styles.sectionTopContainer]}>
                    <Text style={styles.sectionHeaderText}>{strings('settings.profile')}</Text>
                </View>
                {!state.user.isOauth &&
                <Setting label={strings('settings.username')} required={true} value={state.user.username}/>
                }
                <Setting label={strings('settings.email')} required={true} value={state.user.email}
                         onPress={this.showChangeEmail}/>
                <Setting label={strings('settings.first_name')} required={true} onPress={this.showChangeFirstName}
                         value={state.user.firstName}/>
                <Setting label={strings('settings.last_name')} required={true} onPress={this.showChangeLastName}
                         value={state.user.lastName}/>
                <View style={styles.countryContainer}>
                    <CountryPicker
                        onChange={this.countryChanged}
                        cca2={this.state.cca2}
                        translation='eng'
                        closeable={true}
                        filterable={true}>
                        <View style={styles.countryRowContainer}>
                            <View style={styles.rowInnerContainer}>
                                {!state.user.country &&
                                <Icon name='exclamation-circle' style={styles.requiredIcon}/>
                                }
                                <Text style={styles.leftText}>{strings('settings.country')}</Text>
                            </View>
                            <Text style={styles.rightText}>{state.user.country}</Text>
                        </View>
                    </CountryPicker>
                </View>
                {!requiredOnly &&
                <Setting label={strings('settings.passport')} onPress={this.showPassportModal}
                         value={state.user.passport}/>
                }
                {!requiredOnly && !state.user.isOauth &&
                <Setting label={strings('settings.change_password')} onPress={this.showChangePassword}/>
                }
                {!requiredOnly &&
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderText}>{strings('settings.payment')}</Text>
                </View>
                }
                {!requiredOnly &&
                <Setting
                    label={strings('settings.swift')} onPress={this.showSwiftModal}
                    value={state.user.swift}/>
                }
                {!requiredOnly &&
                <Setting
                    label={strings('settings.account_number')} onPress={this.showAccountNumberModal}
                    value={state.user.accountNumber}/>
                }
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderText}>{strings('settings.address')}</Text>
                </View>
                <Setting label={strings('settings.address_street_name')} onPress={this.showStreetNameModal}
                         value={state.user.addressStreetName} required={true}/>
                <Setting label={strings('settings.address_street_number')} onPress={this.showStreetNumberModal}
                         value={state.user.addressStreetNumber} required={true}/>
                <Setting label={strings('settings.address_postal_code')} onPress={this.showPostalCodeModal}
                         value={state.user.addressPostalCode} required={true}/>
                <Setting label={strings('settings.address_city')} onPress={this.showCityModal}
                         value={state.user.addressCity} required={true}/>
                <Setting label={strings('settings.address_country')} onPress={this.showCountryModal}
                         value={state.user.addressCountry} required={true}/>
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderText}>{strings('settings.legal_privacy')}</Text>
                </View>
                <TouchableOpacity style={styles.rowContainer} onPress={this.openTermsOfServiceModal}>
                    <View style={styles.rowInnerContainer}>
                        {!state.user.acceptedTermsOfService &&
                        <Icon name='exclamation-circle' style={styles.requiredIcon}/>
                        }
                        <Text style={styles.leftText}>{strings('register.terms_of_service_1')}</Text>
                        <Text style={styles.leftButtonText}>{strings('register.terms_of_service_2')}</Text>
                    </View>
                    <Switch value={state.user.acceptedTermsOfService}
                            tintColor={Platform.OS === 'ios' ? colors.activeTabColor : undefined}
                            thumbTintColor={colors.activeTabColor}
                            onValueChange={this.acceptTermsOfService}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={this.openPrivacyPolicyModal}>
                    <View style={styles.rowInnerContainer}>
                        {!state.user.acceptedPrivacyPolicy &&
                        <Icon name='exclamation-circle' style={styles.requiredIcon}/>
                        }
                        <Text style={styles.leftText}>{strings('register.privacy_policy_1')}</Text>
                        <Text style={styles.leftButtonText}>{strings('register.privacy_policy_2')}</Text>
                    </View>
                    <Switch value={state.user.acceptedPrivacyPolicy}
                            tintColor={Platform.OS === 'ios' ? colors.activeTabColor : undefined}
                            thumbTintColor={colors.activeTabColor}
                            onValueChange={this.acceptPrivacyPolicy}/>
                </TouchableOpacity>
                {!requiredOnly &&
                <View style={styles.sectionHeaderContainer}>
                </View>
                }
                {!requiredOnly &&
                <Setting label={strings('settings.sign_out')} containerStyle={styles.rowCenterContainer}
                         labelStyle={styles.redText} onPress={this.showSignOut}/>
                }
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
                            returnKeyType='next'
                            onSubmitEditing={this.focusThirdTextInput}
                        />}
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
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid={colors.activeTabColor}
                            tintColor={colors.activeTabColor}
                            numberOfLines={1}
                            editable={true}
                        />}
                        <Text
                            style={this.state.modalInputError ? styles.modalInputErrorText : styles.hidden}>{this.state.modalInputError}</Text>
                    </View>
                </ModalScreen>
                <ModalScreen
                    modalTitle={strings('register.terms_of_service_title')}
                    noCancelButton={true}
                    onSubmit={this.closeTermsOfServiceModal}
                    onBack={this.closeTermsOfServiceModal}
                    onCancel={this.closeTermsOfServiceModal}
                    fullScreen={true}
                    visible={this.props.state.navigation.modal['termsOfServiceModal'] || false}>
                    <ScrollView>
                        <Text>{strings('register.terms_of_service')}</Text>
                    </ScrollView>
                </ModalScreen>
                <ModalScreen
                    modalTitle={strings('register.privacy_policy_title')}
                    noCancelButton={true}
                    onSubmit={this.closePrivacyPolicyModal}
                    onBack={this.closePrivacyPolicyModal}
                    onCancel={this.closePrivacyPolicyModal}
                    fullScreen={true}
                    visible={this.props.state.navigation.modal['privacyPolicyModal'] || false}>
                    <ScrollView>
                        <Text>{strings('register.privacy_policy')}</Text>
                    </ScrollView>
                </ModalScreen>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    hidden: {
        display: 'none'
    },
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    tabBarIcon: {
        fontSize: 20
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    rowCenterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    rowInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countryContainer: {
        marginBottom: 5,
        marginTop: 5,
    },
    countryRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    sectionTopContainer: {
        marginTop: Platform.OS === 'ios' ? 15 : 20
    },
    sectionHeaderContainer: {
        backgroundColor: colors.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15
    },
    leftText: {
        marginLeft: 10
    },
    leftButtonText: {
        marginLeft: 10,
        color: colors.submitButtonColor
    },
    redText: {
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
        marginTop: 10,
        textAlign: 'center',
        color: colors.cancelButtonColor
    },
    requiredIcon: {
        fontSize: 15,
        height: undefined,
        width: undefined,
        color: colors.cancelButtonColor
    },
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