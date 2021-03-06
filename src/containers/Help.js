import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {View, StyleSheet, TouchableOpacity, WebView, ScrollView} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import {strings} from '../shared/i18n';
import ModalScreen from '../components/Modal';
import CustomText from '../components/CustomText';
import FastImage from 'react-native-fast-image';

class Help extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    static navigationOptions = {
        title: strings('help.help'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    onGuidePress = () => {
        this.props.actions.navigateGuide();
    };

    onContactPress = () => {
        this.props.actions.navigateContact();
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
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>
                <View style={styles.topContainer}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={require('../../assets/help.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.sectionHeaderTopContainer}>
                        <CustomText style={styles.sectionHeaderText}>{strings('help.help')}</CustomText>
                    </View>
                    <TouchableOpacity style={styles.rowContainer} onPress={this.onContactPress}>
                        <CustomText style={styles.leftText}>{strings('help.contact')}</CustomText>
                        <Icon name='angle-right' style={styles.rightText}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowContainer} onPress={this.onGuidePress}>
                        <CustomText style={styles.leftText}>{strings('help.guide')}</CustomText>
                        <Icon name='angle-right' style={styles.rightText}/>
                    </TouchableOpacity>
                    <View style={styles.sectionHeaderContainer}>
                        <CustomText style={styles.sectionHeaderText}>{strings('settings.legal_privacy')}</CustomText>
                    </View>
                    <TouchableOpacity style={styles.rowContainer} onPress={this.openTermsOfServiceModal}>
                        <CustomText style={styles.leftText}>{strings('register.terms_of_service_2')}</CustomText>
                        <Icon name='angle-right' style={styles.rightText}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowContainer} onPress={this.openPrivacyPolicyModal}>
                        <CustomText style={styles.leftText}>{strings('register.privacy_policy_2')}</CustomText>
                        <Icon name='angle-right' style={styles.rightText}/>
                    </TouchableOpacity>
                </View>
                <ModalScreen
                    modalTitle={strings('register.terms_of_service_title')}
                    onSubmit={this.closeTermsOfServiceModal}
                    onBack={this.closeTermsOfServiceModal}
                    onCancel={this.closeTermsOfServiceModal}
                    fullScreen={true}
                    contentContainerStyle={styles.policyContainer}
                    visible={this.props.state.navigation.modal['termsOfServiceModal'] || false}>
                    <View style={styles.policyContainer}>
                        <WebView originWhitelist={['*']} style={styles.policyContainer} source={{html: strings('register.terms_of_service')}}/>
                    </View>
                </ModalScreen>
                <ModalScreen
                    modalTitle={strings('register.privacy_policy_title')}
                    onSubmit={this.closePrivacyPolicyModal}
                    onBack={this.closePrivacyPolicyModal}
                    onCancel={this.closePrivacyPolicyModal}
                    contentContainerStyle={styles.policyContainer}
                    fullScreen={true}
                    visible={this.props.state.navigation.modal['privacyPolicyModal'] || false}>
                    <View style={styles.policyContainer}>
                        <WebView originWhitelist={['*']} style={styles.policyContainer} source={{html: strings('register.privacy_policy')}}/>
                    </View>
                </ModalScreen>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor
    },
    contentContainer: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        paddingBottom: 10
    },
    topContainer: {
        flex: 0.5,
        padding: '10%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    bottomContainer: {
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    sectionHeaderTopContainer: {
        backgroundColor: colors.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 15
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: colors.whiteColor,
        padding: 15,
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    leftText: {
        color: colors.backgroundColor,
        fontSize: 15,
        marginLeft: 10,
        alignSelf: 'stretch',
    },
    rightText: {
        marginRight: 10,
        fontSize: 25,
        color: colors.submitButtonColor
    },
    sectionHeaderText: {
        fontSize: 18,
        marginLeft: 10,
        textAlign: 'center',
        color: colors.whiteColor
    },
    policyContainer: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation
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
)(Help);