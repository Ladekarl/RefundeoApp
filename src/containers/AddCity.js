import React, {Component} from 'react';
import {
    ActivityIndicator,
    PixelRatio,
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
                    placeholder={strings('cities.search')}
                    minLength={2}
                    autoFocus={true}
                    listViewDisplayed='auto'
                    enablePoweredByContainer={true}
                    listUnderlayColor={colors.backgroundColor}
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
                    <ActivityIndicator size='large' color={colors.activeTabColor} style={styles.activityIndicator}/>
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor
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
        backgroundColor: colors.backgroundColor,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        margin: 0,
        borderTopColor: colors.backgroundColor
    },
    container: {
        backgroundColor: colors.backgroundColor
    },
    textInput: {
        fontFamily: 'Lato',
        fontSize: 17,
        height: 40,
    },
    description: {
        color: colors.whiteColor,
        fontFamily: 'Lato',
        fontSize: 16,
        paddingLeft: 10
    },
    row: {
        backgroundColor: colors.listBackgroundColor,
        borderWidth: 2,
        borderColor: colors.addButtonOuterColor,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        height: 40,
        padding: 0,
        alignItems: 'center'
    },
    separator: {
        margin: 2,
        backgroundColor: colors.backgroundColor,
        borderWidth: 0
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor,
        margin: 0,
        padding: 0
    },
    powered: {
        tintColor: colors.whiteColor,
        height: 12,
        margin: 0,
        padding: 0
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