import React, {Component} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import colors from '../shared/colors';
import {strings} from '../shared/i18n';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class DrawerScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        navigation: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {actions} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableWithoutFeedback onPress={actions.closeDrawer}>
                        <View style={styles.headerIconTextContainer}>
                            <View style={styles.headerIconContainer}>
                                <Icon name='user' style={styles.headerIcon}/>
                            </View>
                            <Text numberOfLines={2}
                                  style={styles.headerText}>{`${this.props.state.user.firstName} ${this.props.state.user.lastName}`}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.divider}/>
                <ScrollView style={styles.drawerItemsContainer}>
                    <TouchableOpacity onPress={actions.navigateDrawerHome}>
                        <Text style={styles.drawerItemText}>{strings('drawer.home')}</Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.footerIconContainer} onPress={actions.navigateDrawerSettings}>
                        <Icon name='cog' style={styles.footerIcon}/>
                        <Text>{strings('drawer.settings')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerIconContainer} onPress={actions.logout}>
                        <Icon name='sign-out' style={styles.footerIcon}/>
                        <Text>{strings('drawer.logout')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    headerContainer: {
        flex: 0.5,
        justifyContent: 'center',
        backgroundColor: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor
    },
    headerIconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawerItemsContainer: {
        flex: 3,
        paddingTop: 15
    },
    drawerItemText: {
        fontSize: 20,
        marginLeft: 80,
        marginTop: 15,
        marginBottom: 15
    },
    headerIconContainer: {
        height: 55,
        width: 55,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 20,
        borderRadius: 100,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    footerIconContainer: {
        marginTop: 10,
        marginBottom: 20,
        marginRight: 40,
        marginLeft: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerIcon: {
        fontSize: 35,
        height: undefined,
        width: undefined,
        color: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor
    },
    footerIcon: {
        fontSize: 25,
        height: undefined,
        width: undefined,
        color: colors.activeTabColor,
        margin: 5
    },
    headerText: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 15,
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor
    },
    divider: {
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation,
            ...state.authReducer
        }
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DrawerScreen);