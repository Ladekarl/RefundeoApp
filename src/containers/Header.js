import React, {Component} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../shared/colors';
import PropTypes from 'prop-types';
import Icon from 'react-native-fa-icons';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {hasDrawer} from '../navigation/NavigationConfiguration';

class HeaderScreen extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    openDrawer = () => {
        this.props.actions.toggleDrawer();
    };

    openSettings = () => {
        this.props.actions.navigateSettings();
    };

    render() {
        return (
            <View style={styles.container}>
                {hasDrawer &&
                <TouchableOpacity style={styles.headerButton} onPress={this.openDrawer}>
                    <Icon name='bars' style={styles.drawerIcon}/>
                </TouchableOpacity>
                }
                {!hasDrawer &&
                <View style={styles.noDrawerHeader}>
                    <Image style={styles.leftLogo} source={require('../../assets/images/refundeo_logo.png')}/>
                </View>
                }
                <Text style={styles.headerText}>Refundeo</Text>
                <TouchableOpacity style={hasDrawer ? styles.headerButton : styles.noDrawerHeader}
                                  onPress={this.openSettings}>
                    <Icon name='cog' style={hasDrawer ? styles.drawerIcon : styles.noDrawerIcon}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Platform.OS === 'ios' ? colors.activeTabColor : colors.backgroundColor,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 20,
        paddingBottom: 10
    },
    headerText: {
        fontSize: 20,
        color: Platform.OS === 'ios' ? colors.backgroundColor : colors.activeTabColor,
        fontWeight: 'bold'
    },
    headerButton: {
        height: 35,
        width: 35,
        borderRadius: 100,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.activeTabColor
    },
    noDrawerHeader: {
        height: 35,
        width: 35,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftLogo: {
        height: 35,
        width: 35
    },
    drawerIcon: {
        fontSize: Platform.OS === 'ios' ? 20 : 15,
        height: undefined,
        width: undefined,
        color: colors.backgroundColor
    },
    noDrawerIcon: {
        fontSize: 25,
        color: colors.activeTabColor
    }
});

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation
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
)(HeaderScreen);