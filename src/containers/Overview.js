import React, {Component} from 'react';
import {RefreshControl, Dimensions, StyleSheet, Platform, View, FlatList, TouchableOpacity, Image, Text} from 'react-native';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';
import EmptyOverviewScreen from '../components/EmptyOverview';
import RefundCaseScreen from '../components/RefundCase';
import LinearGradient from 'react-native-linear-gradient';
import {strings} from '../shared/i18n';
import ImagePicker from 'react-native-image-picker';
import ModalScreen from '../components/Modal';

const {height, width} = Dimensions.get('window');

class OverviewScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        tabBarIcon: ({tintColor}) => (
            <Icon name='list' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    pressedRefundCase;
    refundCaseImage = '';

    constructor(props) {
        super(props);
    }

    navigateScanner = () => {
        this.props.actions.navigateScanner();
    };

    handleIconPressed = (refundCase) => {
        this.pressedRefundCase = refundCase;
        this._showImagePicker();
    };

    _showImagePicker = () => {
        const options = {
            title: strings('refund_case.choose_photo'),
            mediaType: 'photo',
            quality: 0.3,
            noData: true,
            storageOption: {
                skipBackup: true
            },
            permissionDenied: {
                reTryTitle: strings('refund_case.permission_try_again'),
                okTitle: strings('refund_case.permission_ok'),
                title: strings('refund_case.permission_title'),
                text: strings('refund_case.permission_text')
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (!response.error && !response.didCancel) {
                this.closeModal();
                const photoPath = response.uri;
                const uploadUri = Platform.OS === 'ios' ? photoPath.replace('file://', '') : photoPath;
                this.props.actions.uploadDocumentation(this.pressedRefundCase, uploadUri);
            }
        });
    };

    handleModalImagePress = () => {
        this._showImagePicker();
    };

    handleRefundCasePress = () => {
        const refundCase = this.pressedRefundCase;
        if (!refundCase) return;
        const isAccepted = refundCase.isAccepted;
        const isRequested = refundCase.isRequested;
        const isRejected = refundCase.isRejected;
        const documentation = refundCase.documentation;

        if (isAccepted || isRequested || isRejected) return;
        if (documentation) {
            this.props.actions.requestRefund(refundCase);
            this.closeModal();
        } else {
            this._showImagePicker();
        }
    };

    onRefundCasePress = (refundCase) => {
        this.pressedRefundCase = refundCase;
        if (!refundCase) return;
        const documentation = refundCase.documentation;
        if (documentation) {
            this.refundCaseImage = 'data:image/jpg;base64,' + refundCase.documentation;
            this.openModal();
        } else {
            this.handleRefundCasePress();
        }
    };

    closeModal = () => {
        this.props.actions.closeModal('refundCaseModal');
    };

    openModal = () => {
        this.props.actions.openModal('refundCaseModal');
    };

    getLinearGradientColors = () => {
        return Platform.OS === 'ios' ? [colors.activeTabColor, colors.gradientColor] : [colors.whiteColor, colors.backgroundColor, colors.slightlyDarkerColor];
    };

    _renderRefundCase = ({item}) => (
        <RefundCaseScreen refundCase={item} onPress={this.onRefundCasePress} onIconPress={this.handleIconPressed}/>
    );

    _keyExtractor = (refundCase) => refundCase.id.toString();

    _renderSeparator = () => {
        return (
            <View
                style={styles.separatorStyle}
            />
        );
    };

    render() {
        const {actions, state} = this.props;
        const {refundCases, fetchingRefundCases, fetchingDocumentation, fetchingRequestRefund, navigation} = state;

        return (
            <LinearGradient colors={this.getLinearGradientColors()} style={styles.linearGradient}>
                <FlatList
                    style={styles.container}
                    contentContainerStyle={[styles.scrollContainer, refundCases.length === 0 ? styles.emptyContainer : {}]}
                    refreshControl={
                        <RefreshControl
                            tintColor={Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor}
                            refreshing={fetchingRefundCases || fetchingDocumentation || fetchingRequestRefund}
                            onRefresh={actions.getRefundCases}
                        />
                    }
                    ItemSeparatorComponent={this._renderSeparator}
                    data={refundCases}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderRefundCase}
                    ListEmptyComponent={!fetchingRefundCases ? <EmptyOverviewScreen actions={actions}/> : undefined}
                />
                <ModalScreen
                    modalTitle={strings('refund_case.request_documentation')}
                    onSubmit={this.handleRefundCasePress}
                    onBack={this.closeModal}
                    onCancel={this.closeModal}
                    contentContainerStyle={styles.modalContentContainer}
                    visible={navigation.modal['refundCaseModal'] || false}>
                    <TouchableOpacity style={styles.modalContainer} onPress={this.handleModalImagePress}>
                        <Image resizeMode='contain' style={styles.modalImage}
                               source={{uri: this.refundCaseImage}}/>
                    </TouchableOpacity>
                </ModalScreen>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    scrollContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1
    },
    tabBarIcon: {
        fontSize: 20
    },
    linearGradient: {
        flex: 1
    },
    separatorStyle: {
        height: 1,
        backgroundColor: colors.separatorColor,
        marginLeft: 65,
        marginBottom: 5
    },
    modalContentContainer: {
        height: '100%',
        width: '100%'
    },
    modalContainer: {
        height: height * 0.7,
        justifyContent: 'space-between',
    },
    modalImage: {
        flex: 1,
        height: undefined,
        borderRadius: 5,
        resizeMode: 'contain',
        width: undefined
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
            ...state.refundReducer
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
)(OverviewScreen);