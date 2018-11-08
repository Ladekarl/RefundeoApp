import React, {Component} from 'react';
import {ActivityIndicator, View, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../shared/colors';
import PropTypes from 'prop-types';


const windowWidth = Dimensions.get('window').width;

export default class PlaceHolderFastImage extends Component {

    static propTypes = {
        ...FastImage.propTypes,
        placeHolder: PropTypes.string
    };

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
            source
        } = this.props;

        const height = this.state.style && this.state.style.height ?
            this.state.style.height : 30;

        const top = (height / 2) - 15;

        const left = this.state.style && this.state.style.width === 'auto' ?
            (windowWidth / 2 - 30) : this.state.style && this.state.style.width ?
                (this.state.style.width / 2 - 15) : 0;

        const placeHolderImage = placeHolder ?
            placeHolder : require('../../assets/refundeo_logo.png');

        return <View style={style}>
            {!this.state.loaded || this.state.error &&
            <View>
                <FastImage
                    source={placeHolderImage}
                    style={style}
                />
                {!this.state.error &&
                <View style={[
                    styles.loading, {
                        top: top,
                        left: left
                    }]}>
                    <ActivityIndicator size='large' color={colors.backgroundColor}/>
                </View>
                }
            </View>
            }
            <FastImage
                source={source}
                style={this.state.loaded && !this.state.error ? style : styles.imageNotLoaded}
                onLoadEnd={this.onLoadEnd.bind(this)}
                onError={this.onError.bind(this)}
            />
        </View>;
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute'
    },
    imageNotLoaded: {
        width: 0,
        height: 0
    }
});