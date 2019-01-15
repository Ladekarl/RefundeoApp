import React, {PureComponent} from 'react';
import {
    Modal,
    Picker,
    StyleSheet,
    TouchableOpacity,
    View,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
    ViewPropTypes
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import Icon from 'react-native-fa-icons';
import CustomText from '../components/CustomText';

export default class ModalScreen extends PureComponent {

    static propTypes = {
        onPickerValueChange: PropTypes.func,
        selectedPickerValue: PropTypes.string,
        isPicker: PropTypes.bool,
        pickerItems: PropTypes.array,
        modalTitle: PropTypes.string.isRequired,
        noChildren: PropTypes.bool,
        visible: PropTypes.bool.isRequired,
        onSubmit: PropTypes.func,
        onCancel: PropTypes.func,
        fetching: PropTypes.bool,
        onBack: PropTypes.func,
        noCancelButton: PropTypes.bool,
        noSubmitButton: PropTypes.bool,
        contentContainerStyle: ViewPropTypes.style,
        topContainerStyle: ViewPropTypes.style,
        fullScreen: PropTypes.bool,
        children: PropTypes.element,
        keyboardVerticalOffset: PropTypes.number
    };

    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        onCancel: () => {
        },
        onSubmit: () => {
        },
        onPickerValueChange: () => {
        },
        onBack: () => {
        },
        contentContainerStyle: {},
        topContainerStyle: {},
        keyboardVerticalOffset: 0
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            onPickerValueChange,
            selectedPickerValue,
            isPicker,
            pickerItems,
            modalTitle,
            visible,
            onSubmit,
            onCancel,
            onBack,
            noCancelButton,
            noSubmitButton,
            children,
            noChildren,
            fetching,
            contentContainerStyle,
            topContainerStyle,
            fullScreen,
            keyboardVerticalOffset
        } = this.props;

        return (
            <Modal
                animationType='fade'
                transparent={true}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={onBack}
                visible={visible}>
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? -100 + keyboardVerticalOffset : -300 + keyboardVerticalOffset}
                    behavior='padding'>
                    <View
                        style={[styles.modalInnerContainer, fullScreen ? styles.fullInnerContainer : {}]}>
                        <SafeAreaView style={[styles.safeContainer, fullScreen ? styles.fullSafeContainer : {}]}>
                            <View
                                style={[styles.modalTopContainer, topContainerStyle]}>
                                {!noCancelButton &&
                                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                    <Icon style={styles.cancelIcon} name='times'/>
                                </TouchableOpacity>}
                                {noCancelButton &&
                                <View style={styles.emptyContainer}/>}
                                <CustomText style={styles.modalTitleText}>{modalTitle}</CustomText>
                                <View style={styles.emptyContainer}/>
                            </View>
                        </SafeAreaView>
                        <View
                            style={[styles.modalCenterContainer, contentContainerStyle, fullScreen ? styles.fullCenterContainer : {}]}>
                            {isPicker &&
                            <View style={styles.modalPickerContainer}>
                                <Picker
                                    mode='dialog'
                                    onValueChange={onPickerValueChange}
                                    selectedValue={selectedPickerValue}>
                                    {pickerItems}
                                </Picker>
                            </View>}
                            {!noChildren && children}
                        </View>
                        {(!noCancelButton || !noSubmitButton) &&
                        <SafeAreaView style={styles.modalBottomContainer} forceInset={{'bottom': fullScreen ? 'always' : 'never'}}>
                            {!noSubmitButton &&
                            <TouchableOpacity
                                style={styles.modalSubmitButton}
                                disabled={fetching}
                                onPress={onSubmit}>
                                <CustomText style={styles.modalButtonText}>{strings('modal.ok')}</CustomText>
                            </TouchableOpacity>}
                        </SafeAreaView>
                        }
                    </View>
                </KeyboardAvoidingView>
                {fetching &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.activeTabColor} style={styles.activityIndicator}/>
                </View>
                }
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    modalInnerContainer: {
        maxHeight: '100%',
        width: '90%',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        backgroundColor: colors.backgroundColor
    },
    safeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        backgroundColor: colors.backgroundColor,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4
    },
    fullSafeContainer: {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
    },
    modalTopContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2,
        padding: 12,
        backgroundColor: colors.backgroundColor
    },
    modalCenterContainer: {
        width: '100%',
        paddingLeft: 12,
        paddingRight: 12,
    },
    modalBottomContainer: {
        justifyContent: 'center',
        width: '100%',
        alignItems: 'stretch',
        padding: 6
    },
    modalPickerContainer: {
        padding: 10,
        margin: 5,
        borderRadius: 5
    },
    modalSubmitButton: {
        margin: 6,
        alignItems: 'center',
        backgroundColor: colors.submitButtonColor,
        borderRadius: 2
    },
    modalButtonText: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
        color: colors.whiteColor,
        fontWeight: 'bold'
    },
    modalTitleText: {
        flex: 5,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.whiteColor
    },
    emptyContainer: {
        flex: 1,
        marginRight: 10
    },
    cancelButton: {
        flex: 1,
        marginLeft: 10
    },
    cancelIcon: {
        fontSize: 20,
        color: colors.whiteColor
    },
    fullCenterContainer: {
        flex: 1,
    },
    fullInnerContainer: {
        height: '100%',
        width: '100%',
        borderRadius: 0
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityIndicator: {
        elevation: 10
    }
});