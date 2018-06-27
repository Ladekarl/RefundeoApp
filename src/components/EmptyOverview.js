import React, {PureComponent} from 'react';
import {Image, Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';

import Swiper from 'react-native-swiper';
import TutorialPage from './TutorialPage';
import {strings} from '../shared/i18n';

export default class EmptyOverviewScreen extends PureComponent {

    static navigationOptions = {
        title: 'Help',
        headerTitleStyle: {
            fontSize: 18
        }
    };

    render() {
        return (
            <Swiper
                style={styles.container}
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
                    headline={strings('tutorial.welcome_title')}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Image style={styles.logoImage} source={require('../../assets/refundeo_logo.png')}/>}
                    text={strings('tutorial.welcome_text')}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='play'/>}
                    headline={strings('tutorial.initiate_title')}
                    text={strings('tutorial.initiate_text')}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='print'/>}
                    headline={strings('tutorial.print_title')}
                    text={strings('tutorial.print_text')}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='thumbs-o-up'/>}
                    headline={strings('tutorial.approval_title')}
                    text={strings('tutorial.approval_text')}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='camera'/>}
                    headline={strings('tutorial.upload_title')}
                    text={strings('tutorial.upload_text')}/>
                <TutorialPage
                    contentColor={colors.activeTabColor}
                    headlineColor={colors.backgroundColor}
                    textColor={colors.separatorColor}
                    icon={<Icon style={styles.logoButton} name='check'/>}
                    headline={strings('tutorial.done_title')}
                    text={strings('tutorial.done_text')}/>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColor
    },
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

