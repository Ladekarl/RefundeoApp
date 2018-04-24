import React, {Component} from 'react';
import {addNavigationHelpers} from 'react-navigation';
import {connect} from 'react-redux';
import {BackHandler} from 'react-native';
import {RootNavigator} from './NavigationConfiguration';
import PropTypes from 'prop-types';
import {addListener} from '../store';
import Actions from '../actions/Actions';
import {bindActionCreators} from 'redux';

class AppNavigator extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        navigation: PropTypes.shape().isRequired,
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.backHandlerSub = BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        this.backHandlerSub.remove()
    }

    _handleBackPress = () => {
        if (this.props.state.drawerOpen) {
            this.props.actions.closeDrawer();
            return true;
        }
        if (this._shouldCloseApp(this.props.navigation)) {
            return false;
        }
        this.props.actions.navigateBack();
        return true;
    };

    _shouldCloseApp = (nav) => {
        if (nav.index > 0) return false;

        if (nav.routes) {
            return nav.routes.every(this._shouldCloseApp);
        }

        return true;
    };

    render() {
        const {dispatch, navigation} = this.props;

        return (
            <RootNavigator
                navigation={addNavigationHelpers({
                    dispatch,
                    state: navigation,
                    addListener
                })}
            />
        );
    }
}

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        navigation,
        state: {
            ...state.navigationReducer
        }
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch),
        dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppNavigator)