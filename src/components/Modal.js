import React, {Component} from 'react';
import {Modal, Picker, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';

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
        containerStyle: PropTypes.array,
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
        }
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
            noChildren
        } = this.props;

        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={onBack}
                visible={visible}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalInnerContainer]}>
                        <View style={styles.modalTopContainer}>
                            <Text style={styles.modalTitleText}>{modalTitle}</Text>
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
                            {!noCancelButton &&
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={onCancel}>
                                <Text style={styles.modalButtonText}>{strings('modal.cancel')}</Text>
                            </TouchableOpacity>
                            }
                        </View>
                        }
                    </View>
                </View>
            </Modal>
        )
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
        backgroundColor: 'transparent'
    },
    modalInnerContainer: {
        maxHeight: '100%',
        width: '90%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
        elevation: 5,
        borderWidth: Platform.OS === 'ios' ? 1 : 0,
        backgroundColor: colors.backgroundColor
    },
    modalTopContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12
    },
    modalCenterContainer: {
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
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
    modalCancelButton: {
        backgroundColor: colors.cancelButtonColor,
        borderRadius: 2,
        alignItems: 'center',
        margin: 6
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
        fontSize: 18,
        fontWeight: 'bold'
    }
});