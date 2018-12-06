import React, {Component} from 'react';
import {ActivityIndicator, View, StyleSheet, Dimensions, ViewPropTypes} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../shared/colors';
import PropTypes from 'prop-types';


const windowWidth = Dimensions.get('window').width;

export default class PlaceHolderFastImage extends Component {

    static propTypes = {
        ...FastImage.propTypes,
        contentContainerStyle: ViewPropTypes.style,
        placeHolder: PropTypes.string
    };

    disallowedProps = ['style', 'source', 'onLoadEnd', 'onError'];

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            error: false,
            style: StyleSheet.flatten(props.style)
        };
    }

    onLoadEnd() {
        this.setState({loaded: true});
    }

    onError() {
        this.setState({error: true});
    }

    render() {
        const {
            placeHolder,
            style,
            contentContainerStyle,
            source
        } = this.props;

        const placeHolderImage = placeHolder ?
            placeHolder : require('../../assets/refundeo_logo.png');

        const propsToPass = Object.keys(this.props)
            .filter(k => this.disallowedProps.indexOf(k) === -1)
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {});

        return (
            <View style={contentContainerStyle ? contentContainerStyle : styles.container}>
                {!this.state.loaded || this.state.error &&
                <View style={styles.container}>
                    {!this.state.error &&
                    <View style={styles.loading}>
                        <ActivityIndicator color={colors.backgroundColor}/>
                    </View>
                    }
                    {this.state.error &&
                    <FastImage
                        source={placeHolderImage}
                        style={style}
                        {...propsToPass}
                    />
                    }
                </View>
                }
                <FastImage
                    source={source}
                    style={this.state.loaded && !this.state.error ? style : styles.imageNotLoaded}
                    onLoadEnd={this.onLoadEnd.bind(this)}
                    onError={this.onError.bind(this)}
                    {...propsToPass}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loading: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageNotLoaded: {
        flex: 0,
        width: 0,
        height: 0
    }
});