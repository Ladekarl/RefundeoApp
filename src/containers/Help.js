import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import {Text, View} from 'react-native';

class Help extends PureComponent {

    static navigationOptions = {
        title: 'Help',
        headerTitleStyle: {
            fontSize: 18
        }
    };

    render() {
        return (
            <View>
                <Text>Guide</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        state: {
            navigation
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Help);