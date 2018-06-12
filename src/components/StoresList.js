import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Platform, Image} from 'react-native';
import colors from '../shared/colors';

export default class StoresList extends Component {

    _handlePress = () => {
        // do something
    };

    render() {
        return (
            <ScrollView style={styles.scrollContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.container}
                    onPress={() => {
                    }}>
                    <View style={styles.cardContainer}>
                        <ImageBackground
                            style={styles.bannerImage}
                            source={require('../../assets/example-store.jpg')}
                            borderRadius={2}>
                            <View style={styles.bannerTextBarContainer}>
                                <View style={styles.leftContainer}>
                                    <Text style={styles.leftText}>125 m</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <Image style={styles.logoImage} source={require('../../assets/refundeo_logo.png')}/>
                                </View>
                                <View style={styles.rightContainer}>
                                    <Text style={styles.rightText}>Refund: 75 %</Text>
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={styles.contentContainer}>
                            <View style={styles.temperatureContainer}>
                                <Text
                                    style={styles.mainText}>Example Store</Text>
                                <Text
                                    style={styles.subText}>08:00 - 21:00</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.container}
                    onPress={() => {
                    }}>
                    <View style={styles.cardContainer}>
                        <ImageBackground
                            style={styles.bannerImage}
                            source={require('../../assets/example-store.jpg')}
                            borderRadius={2}>
                            <View style={styles.bannerTextBarContainer}>
                                <View style={styles.leftContainer}>
                                    <Text style={styles.leftText}>9 km</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <Image style={styles.logoImage} source={require('../../assets/refundeo_logo.png')}/>
                                </View>
                                <View style={styles.rightContainer}>
                                    <Text style={styles.rightText}>Refund: 78 %</Text>
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={styles.contentContainer}>
                            <View style={styles.temperatureContainer}>
                                <Text
                                    style={styles.mainText}>Example Store</Text>
                                <Text
                                    style={styles.subText}>08:00 - 21:00</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.container}
                    onPress={() => {
                    }}>
                    <View style={styles.cardContainer}>
                        <ImageBackground
                            style={styles.bannerImage}
                            source={require('../../assets/example-store.jpg')}
                            borderRadius={2}>
                            <View style={styles.bannerTextBarContainer}>
                                <View style={styles.leftContainer}>
                                    <Text style={styles.leftText}>11 km</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <Image style={styles.logoImage} source={require('../../assets/refundeo_logo.png')}/>
                                </View>
                                <View style={styles.rightContainer}>
                                    <Text style={styles.rightText}>Refund: 86 %</Text>
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={styles.contentContainer}>
                            <View style={styles.temperatureContainer}>
                                <Text
                                    style={styles.mainText}>Example Store</Text>
                                <Text
                                    style={styles.subText}>08:00 - 21:00</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.container}
                    onPress={() => {
                    }}>
                    <View style={styles.cardContainer}>
                        <ImageBackground
                            style={styles.bannerImage}
                            source={require('../../assets/example-store.jpg')}
                            borderRadius={2}>
                            <View style={styles.bannerTextBarContainer}>
                                <View style={styles.leftContainer}>
                                    <Text style={styles.leftText}>15 km</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <Image style={styles.logoImage} source={require('../../assets/refundeo_logo.png')}/>
                                </View>
                                <View style={styles.rightContainer}>
                                    <Text style={styles.rightText}>Refund: 75 %</Text>
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={styles.contentContainer}>
                            <View style={styles.temperatureContainer}>
                                <Text
                                    style={styles.mainText}>Example Store</Text>
                                <Text
                                    style={styles.subText}>08:00 - 21:00</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: colors.slightlyDarkerColor,
    },
    container: {
        justifyContent: 'flex-start',
        backgroundColor: colors.slightlyDarkerColor,
        padding: 3
    },
    iconContainer: {
        zIndex: 999,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: colors.backgroundColor,
        borderRadius: 40,
        padding: 6,
        elevation: 1,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0
    },
    logoImage: {
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardContainer: {
        height: 180,
        marginBottom: 3,
        backgroundColor: colors.backgroundColor,
        borderRadius: 2,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        elevation: 1,
        borderColor: colors.separatorColor
    },
    bannerImage: {
        justifyContent: 'flex-end',
        width: '100%',
        borderRadius: 50,
        height: 120
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 35,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingLeft: 10,
        paddingRight: 10
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftText: {
        fontSize: 15,
        alignSelf: 'flex-start',
        color: colors.backgroundColor,
    },
    rightText: {
        fontSize: 15,
        alignSelf: 'flex-end',
        color: colors.backgroundColor,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    temperatureContainer: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 1,
    },
    mainText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    subText: {
        fontSize: 13
    }
});