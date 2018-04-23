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
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.backHandlerSub = BackHandler.addEventListener('hardwareBackPress', this.backAction);
    }

    componentWillUnmount() {
        this.backHandlerSub.remove()
    }

    backAction = () => {
        this.props.actions.navigateBack();
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

const mapStateToProps = state => ({
    navigation: state.navigationReducer,
});

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