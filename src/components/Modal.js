import React, {Component} from 'react';
import {Modal, Picker, StyleSheet, Text, TouchableOpacity, View, Platform, KeyboardAvoidingView} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import Icon from 'react-native-fa-icons';

export default class ModalScreen extends Component {

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
        onBack: PropTypes.func,
        noCancelButton: PropTypes.bool,
        noSubmitButton: PropTypes.bool,
        contentContainerStyle: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object
        ]),
        children: PropTypes.element
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
        contentContainerStyle: {}
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
            contentContainerStyle
        } = this.props;

        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={onBack}
                visible={visible}>
                <KeyboardAvoidingView style={styles.modalContainer}
                                      keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : -300} behavior='padding'>
                    <View style={[styles.modalInnerContainer, contentContainerStyle]}>
                        <View style={styles.modalTopContainer}>
                            {!noCancelButton &&
                            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                <Icon style={styles.cancelIcon} name='times'/>
                            </TouchableOpacity>
                            }
                            {noCancelButton &&
                            <View style={styles.emptyContainer}/>
                            }
                            <Text style={styles.modalTitleText}>{modalTitle}</Text>
                            <View style={styles.emptyContainer}/>
                        </View>
                        <View style={styles.modalCenterContainer}>
                            {isPicker &&
                            <View style={styles.modalPickerContainer}>
                                <Picker
                                    mode='dialog'
                                    onValueChange={onPickerValueChange}
                                    selectedValue={selectedPickerValue}>
                                    {pickerItems}
                                </Picker>
                            </View>
                            }
                            {!noChildren && children}
                        </View>
                        {(!noCancelButton || !noSubmitButton) &&
                        <View style={styles.modalBottomContainer}>
                            {!noSubmitButton &&
                            <TouchableOpacity
                                style={styles.modalSubmitButton}
                                onPress={onSubmit}>
                                <Text style={styles.modalButtonText}>{strings('modal.ok')}</Text>
                            </TouchableOpacity>
                            }
                        </View>
                        }
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    // eslint-disable-next-line
    modalContainer: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    modalInnerContainer: {
        maxHeight: '100%',
        width: '90%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        backgroundColor: colors.backgroundColor
    },
    modalTopContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 12,
        backgroundColor: colors.activeTabColor
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
        color: colors.backgroundColor,
        fontWeight: 'bold'
    },
    modalTitleText: {
        flex: 3,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.backgroundColor
    },
    emptyContainer: {
        flex: 1
    },
    cancelButton: {
        flex: 1,
        marginLeft: 10
    },
    cancelIcon: {
        fontSize: 20,
        color: colors.backgroundColor
    }
});