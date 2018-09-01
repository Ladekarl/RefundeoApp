import React, {Component} from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View
} from 'react-native';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {getCurrentLocaleFormatted, strings} from '../shared/i18n';
import colors from '../shared/colors';

class AddCity extends Component {

    static navigationOptions = {
        title: strings('cities.add_city'),
        headerTitleStyle: {
            fontSize: 18
        }
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    addCity = (placesData) => {
        const placeId = placesData.place_id;
        this.props.actions.addCity(placeId);
    };

    render() {
        const fetching = this.props.state.fetchingCity;
        return (
            <View style={styles.container}>
                {!fetching &&
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLength={2}
                    autoFocus={false}
                    listViewDisplayed='auto'
                    debounce={200}
                    onPress={this.addCity}
                    getDefaultValue={() => ''}
                    query={{
                        key: 'AIzaSyC06JE1ll4-gDqCc2VsADpBPAzrXw6E8EU',
                        language: getCurrentLocaleFormatted(),
                        types: '(cities)'
                    }}
                    styles={googlePlacesStyles}
                    nearbyPlacesAPI='GooglePlacesSearch'
                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                />
                }
                {fetching &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.whiteColor} style={styles.activityIndicator}/>
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.activeTabColor
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityIndicator: {
        elevation: 10
    }
});

const googlePlacesStyles = StyleSheet.flatten({
    textInputContainer: {
        width: '100%',
        height: 55,
        backgroundColor: colors.activeTabColor,
        borderWidth: 0,
        margin: 0
    },
    container: {
        backgroundColor: colors.activeTabColor
    },
    textInput: {
        fontFamily: 'Lato',
        fontSize: 17,
        height: 40,
    },
    description: {
        color: colors.whiteColor,
        fontFamily: 'Lato',
        fontSize: 17,
        height: 50
    },
    poweredContainer: {
        display: 'none'
    }
});

const mapStateToProps = state => {
    return {
        state: {
            ...state.cityReducer
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
)(AddCity);