import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, Platform, Image, Text, ScrollView} from 'react-native';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';

export default class StoresList extends Component {

    static navigationOptions = {
        title: 'Example store',
        headerTitleStyle: {
            fontSize: 18
        },
        tabBarIcon: ({tintColor}) => (
            <Icon name='user-circle' style={[styles.tabBarIcon, {color: tintColor}]}/>),
    };

    render() {
        return (
            <ScrollView styles={styles.container}>
                <ImageBackground
                    style={styles.bannerImage}
                    source={require('../../assets/example-store.jpg')}
                    borderRadius={2}>
                    <View style={styles.iconContainer}>
                        <Image style={styles.logoImage} resizeMode='contain'
                               source={require('../../assets/refundeo_banner_small.png')}/>
                    </View>
                </ImageBackground>
                <View style={styles.bannerTextBarContainer}>
                    <View style={styles.bannerColumnContainer}>
                        <Text style={styles.leftText}>Opening hours</Text>
                        <Text style={styles.leftText}>Refund Percentage</Text>
                    </View>
                    <View style={styles.bannerColumnContainer}>
                        <Text style={styles.contentText}>09:00 - 21:30</Text>
                        <Text style={styles.contentText}>75 %</Text>
                    </View>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text>
                        {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut gravida elit eros, sit amet accumsan diam pulvinar sit amet.

Aliquam tristique dolor laoreet porttitor laoreet.

Nunc porttitor urna sed ante ultrices faucibus. Proin vulputate arcu sit amet sem accumsan viverra. Maecenas eu lacus vestibulum, tristique nisi at, auctor purus.

Phasellus sit amet placerat purus. Mauris quis mauris sed eros finibus euismod sed placerat felis. Ut sagittis porta leo sit amet pretium.`}
                    </Text>
                </View>
                <View style={styles.addressContainer}>
                    <Text style={styles.addressTitleText}>Address</Text>
                    <Text style={styles.addressText}>Pilestræde 67, 1112 Copenhagen</Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    bannerImage: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor,
        borderRadius: 40,
        padding: 6,
        elevation: 1,
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.separatorColor
    },
    logoImage: {
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.activeTabColor,
        padding: 10
    },
    bannerColumnContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    leftText: {
        margin: 5,
        color: colors.inactiveTabColor
    },
    contentText: {
        margin: 5,
        color: colors.backgroundColor
    },
    descriptionContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    addressContainer: {
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20
    },
    addressTitleText: {
        color: colors.activeTabColor
    },
    addressText: {
        marginTop: 10,
        fontSize: 15
    }
});