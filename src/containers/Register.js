import React, {Component} from 'react';
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import ModalScreen from '../components/Modal';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class RegisterScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        title: strings('register.register'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    constructor(props) {
        super(props);
    }

    closeEulaModal = () => {
        return this.props.actions.closeModal('eulaModal');
    };

    openEulaModal = () => {
        return this.props.actions.openModal('eulaModal');
    };

    render() {
        const {state} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.eulaContainer}>
                    <Text style={styles.eulaText}>
                        {strings('login.eula_agreement_1')}
                        <Text
                            onPress={this.openEulaModal}
                            style={styles.eulaLink}>
                            {strings('login.eula_agreement_2')}
                        </Text>
                    </Text>
                </View>
                {state.fetching &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.activeTabColor} style={styles.activityIndicator}/>
                </View>
                }
                <ModalScreen
                    modalTitle={strings('login.eula_title')}
                    noCancelButton={false}
                    onSubmit={this.closeEulaModal}
                    onBack={this.closeEulaModal}
                    onCancel={this.closeEulaModal}
                    visible={this.props.state.navigation.modal['eulaModal'] || false}>
                    <ScrollView style={styles.eulaModalContainer}>
                        <Text>{Platform.OS === 'ios' ? strings('login.eula_ios') : strings('login.eula_android')}</Text>
                    </ScrollView>
                </ModalScreen>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    eulaContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    eulaModalContainer: {
      maxHeight: '60%'
    },
    eulaText: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
    },
    eulaLink: {
        color: colors.linkColor,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        textDecorationLine: 'underline'
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
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
)(RegisterScreen);