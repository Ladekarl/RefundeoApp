import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Platform,
    TouchableOpacity,
    ImageBackground,
    Alert
} from 'react-native';
import colors from '../shared/colors';
import moment from 'moment';
import I18n from 'react-native-i18n';

import PropTypes from 'prop-types';

export default class RefundCaseScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dateCreatedFormatted: ''
        };
    }

    componentWillMount() {
        const dateCreatedFormatted = this.formatDate(new Date(this.props.refundCase.dateCreated));
        this.setState({
            dateCreatedFormatted
        })
    }

    formatDate(date) {
        const locale = I18n.currentLocale();
        return moment(date).locale(locale).format('L');
    }

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
                            <Text style={styles.headlineText}>{refundCase.merchant.companyName}</Text>
                            <Text style={styles.headlineText}>{this.state.dateCreatedFormatted}</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.contentContainer}>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.descriptionText}>Description</Text>
                    </View>
                    <View style={styles.centerContentContainer}>
                        <Text style={styles.bigText}>Mangler dokumentation</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailContainer}>
                            <Text
                                style={styles.detailText}>Amount</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailText}>weather</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text
                                style={styles.detailText}>pressure</Text>
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
        borderRadius: 3,
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
        opacity: 0.8,
        backgroundColor: colors.activeTabColor,
        paddingLeft: 10,
        paddingRight: 10
    },
    headlineText: {
        fontSize: 15,
        color: colors.backgroundColor,
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
        justifyContent: 'center',
        margin: 5
    },
    descriptionText: {
        textAlign: 'center'
    },
    centerContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    bigText: {
        fontSize: 20,
    },
    detailsContainer: {
        flex: 1
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 2
    },
    detailText: {
        fontSize: 12,
        paddingTop: 1,
        marginLeft: 10
    }
});
