import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-fa-icons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../shared/colors';
import LinearGradient from 'react-native-linear-gradient';
import {strings} from '../shared/i18n';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import PropTypes from 'prop-types';

class ScannerScreen extends Component {

    // noinspection JSUnusedGlobalSymbols
    static navigationOptions = {
        tabBarIcon: ({tintColor}) => (
            <Icon name='camera' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    static propTypes = {
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    onSuccess = (e) => {
        Alert.alert('QR Kode blev scannet', JSON.stringify(e.data));
    };

    getLinearGradientColors = () => {
        return Platform.OS === 'ios' ? [colors.activeTabColor, colors.gradientColor] : [colors.whiteColor, colors.backgroundColor, colors.slightlyDarkerColor];
    };

    render() {
        const {state} = this.props;
        return (
            <LinearGradient colors={this.getLinearGradientColors()} style={styles.container}>
                {state.currentRoute === 'Scanner' &&
                <QRCodeScanner
                    onRead={this.onSuccess}
                    containerStyle={styles.cameraContainer}
                    showMarker={true}
                    customMarker={
                        <View style={styles.rectangleContainer}>
                            <View style={styles.rectangle}/>
                        </View>
                    }
                    reactivateTimeout={2}
                    topContent={
                        <View style={styles.cameraTopContainer}>
                            <Text style={styles.centerText}>
                                {strings('scanner.top_text')}
                            </Text>
                        </View>
                    }
                    cameraStyle={styles.cameraStyle}
                />
                }
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    centerText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    cameraStyle: {
        borderRadius: 2
    },
    cameraTopContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tabBarIcon: {
        fontSize: 20
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: colors.activeTabColor,
        backgroundColor: 'transparent',
    },
});

const mapStateToProps = state => {
    return {
        state: {
            ...state.navigationReducer
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
)(ScannerScreen);