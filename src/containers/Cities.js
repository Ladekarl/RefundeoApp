import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {bindActionCreators} from 'redux';
import Actions from '../actions/Actions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import CustomText from '../components/CustomText';
import colors from '../shared/colors';
import Icon from 'react-native-fa-icons';
import FastImage from 'react-native-fast-image';

class Cities extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    keyExtractor = (city, index) => `city-list-${index.toString()}`;

    _renderSeparator = () => {
        return <View
            style={styles.separatorStyle}
        />;
    };

    renderCity = ({item}) => {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.props.actions.selectCity(item.googlePlaceId)}
                style={styles.cityContainer}>
                <FastImage
                    style={styles.cityImage}
                    source={{uri: item.image}}>
                    <View style={styles.bannerTextBarContainer}>
                        <CustomText style={styles.cityText}>{item.name}</CustomText>
                    </View>
                </FastImage>
            </TouchableOpacity>
        );
    };

    render() {
        const {actions, state} = this.props;
        const citiesMap = state.cities;
        const cities = Array.from(citiesMap.values());


        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.flatListContainer}
                    ItemSeparatorComponent={this._renderSeparator}
                    data={cities}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderCity}
                />
                <View style={styles.buttonContainer}>
                    <View style={styles.refundCasesButtonContainer}>
                        <View style={styles.addButtonInnerContainer}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.refundCasesButton}
                                onPress={actions.navigateOverview}>
                                <Icon style={styles.refundCaseIcon} name='list'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.addButtonContainer}>
                        <View style={styles.addButtonInnerContainer}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.addButton}
                                onPress={actions.navigateAddCity}>
                                <Icon style={styles.addIcon} name='plus'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor
    },
    flatListContainer: {
        backgroundColor: colors.backgroundColor
    },
    separatorStyle: {
        backgroundColor: colors.backgroundColor
    },
    refundCasesButtonContainer: {
        backgroundColor: colors.addButtonOuterColor,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'stretch',
        borderRadius: 50,
        alignSelf: 'center',
        opacity: 0.9
    },
    addButtonContainer: {
        backgroundColor: colors.addButtonOuterColor,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'stretch',
        borderRadius: 50,
        alignSelf: 'center',
        opacity: 0.9
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        opacity: 0.9,
        height: 80,
        backgroundColor: colors.backgroundColor,
    },
    addButtonInnerContainer: {
        backgroundColor: colors.addButtonInnerColor,
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'stretch',
        borderRadius: 50,
    },
    addButton: {
        backgroundColor: colors.activeTabColor,
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    refundCasesButton: {
        backgroundColor: colors.facebookColor,
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    addIcon: {
        fontSize: 30,
        color: colors.whiteColor
    },
    refundCaseIcon: {
        fontSize: 25,
        color: colors.whiteColor
    },
    cityContainer: {
        flex: 1,
        borderWidth: 4,
        borderColor: colors.addButtonOuterColor,
        borderRadius: 15,
        marginLeft: 5,
        marginRight: 5
    },
    cityImage: {
        justifyContent: 'center',
        width: '100%',
        height: 120,
        borderWidth: 4,
        borderColor: colors.addButtonInnerColor,
        borderRadius: 10
    },
    bannerTextBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    cityText: {
        color: colors.whiteColor,
        fontSize: 16,
        fontWeight: 'bold'
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
)(Cities);