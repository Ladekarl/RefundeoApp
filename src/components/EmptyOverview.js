import React, {Component} from 'react';
import {Image, Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';

import Swiper from 'react-native-swiper';
import TutorialPage from './TutorialPage';
import {strings} from '../shared/i18n';

export default class EmptyOverviewScreen extends Component {

    static navigationOptions = {
        title: 'Help',
        headerTitleStyle: {
            fontSize: 18
        }
    };

    render() {
        return (
            <Swiper
                showsButtons={true}
                showsPagination={true}
                loop={false}
                activeDotColor={colors.whiteColor}
                dotColor={'transparent'}
                dotStyle={styles.dotStyle}
                containerStyle={styles.swiperStyle}
                nextButton={<Icon style={styles.arrowButton} name='angle-right'/>}
                prevButton={<Icon style={styles.arrowButton} name='angle-left'/>}>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headline={'Welcome to Refundeo'}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Image style={styles.logoImage} source={require('../../assets/refundeo_logo.png')}/>}
                    text={'Our mission is to offer you an improved experience when shopping tax free.\n\nSwipe right to learn how to claim your tax refund.'}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='file-text-o'/>}
                    headline={'Tax free receipt'}
                    text={'When you purchase an item in one of our partner stores remember to ask them for a tax free receipt.'}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='camera'/>}
                    headline={'Scan the QR Code'}
                    text={'The tax free receipt has a QR code.\nScan it with the app.\n\nYou can now see the amount you will be refunded.'}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='thumbs-o-up'/>}
                    headline={'Receive approval'}
                    text={'Fill in the form on the receipt and get it approved at one of the local tax offices.'}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='upload'/>}
                    headline={'Upload the approved receipt'}
                    text={'Use the app to take a picture of your approved receipt and upload it.\n\nWhen you are satisfied with the picture, request a refund.'}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='check'/>}
                    headline={'Done'}
                    text={'Now you can relax and wait for your refund as we will handle the rest for you.'}/>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    arrowButton: {
        fontSize: 35,
        color: colors.backgroundColor
    },
    swiperStyle: {
        width: Platform.OS === 'ios' ? '100%' : Dimensions.get('window').width
    },
    dotStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.whiteColor
    },
    logoImage: {
        height: 80,
        width: 80
    },
    logoButton: {
        fontSize: 50,
        color: colors.activeTabColor,
    },
});

