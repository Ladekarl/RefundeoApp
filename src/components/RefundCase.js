import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Platform,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import colors from '../shared/colors';

import PropTypes from 'prop-types';

export default class RefundCaseScreen extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        refundCase: PropTypes.object.isRequired
    };

    render() {
        const {actions, refundCase} = this.props;

        return (
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                }}>
                <ImageBackground
                    style={styles.bannerImage}
                    source={require('../../assets/images/refundeo_logo.png')}
                    borderRadius={2}>
                    <View style={styles.bannerTextContainer}>
                        <View style={styles.bannerTextBarContainer}>
                            <Text style={styles.cityText}>name</Text>
                            <Text style={styles.cityText}>distance</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.contentContainer}>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>Description</Text>
                    </View>
                    <View style={styles.temperatureContainer}>
                        <Text
                            style={styles.temperatureText}>temp</Text>
                    </View>
                    <View style={styles.weatherDetailsContainer}>
                        <View style={styles.weatherDetailContainer}>
                            <Text
                                style={styles.weatherDetailsText}>wind</Text>
                        </View>
                        <View style={styles.weatherDetailContainer}>
                            <Text
                                style={styles.weatherDetailsText}>weather</Text>
                        </View>
                        <View style={styles.weatherDetailContainer}>
                            <Text
                                style={styles.weatherDetailsText}>pressure</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 160,
        backgroundColor: colors.backgroundColor,
        borderRadius: 2,
        elevation: 1,
        margin: 5,
        alignSelf: 'center',
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0
    },
    bannerImage: {
        width: '100%',
        borderRadius: 50,
        height: 70
    },
    bannerTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 3,
        opacity: 0.7,
        backgroundColor: colors.weatherBannerBackgroundColor,
        paddingLeft: 10,
        paddingRight: 10
    },
    cityText: {
        fontSize: 15,
        color: colors.weatherBannerTextColor,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20
    },
    descriptionContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 1,
    },
    descriptionText: {
        textAlign: 'center'
    },
    temperatureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    temperatureText: {
        fontSize: 20,
    },
    weatherDetailsContainer: {
        flex: 1
    },
    weatherDetailContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 2
    },
    weatherDetailsText: {
        fontSize: 12,
        paddingTop: 1,
        marginLeft: 10
    }
});
