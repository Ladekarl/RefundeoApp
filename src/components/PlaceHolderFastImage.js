import React, {Component} from 'react';
import {ActivityIndicator, View, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import colors from '../shared/colors';

const {width} = Dimensions.get('window');

export default class PlaceHolderFastImage extends Component {

    static propTypes = {
        placeholder: PropTypes.element,
        ...FastImage.propTypes
    };

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            error: false,
            style: StyleSheet.flatten(props.style)
        };
    }

    onLoadEnd = () => {
        this.setState({loaded: true});
    };

    onError = () => {
        this.setState({error: true});
    };

    render() {

        const {placeholder} = this.props;

        let topHeight = width / 2, leftWidth = width / 2;

        if (this.state && this.state.style) {
            if (this.state.style.height) {
                topHeight = 30;
            }
            if (this.state.style.width) {
                leftWidth = 30;
            }
        }

        const top = (topHeight / 2) - 15;
        const left = leftWidth === 'auto' ? (width / 2 - 30) : (width / 2 - 15);

        return <View style={this.props.style}>
            {
                !this.state.loaded || this.state.error &&
                <View>
                    {placeholder}
                    {
                        !this.state.error &&
                        <View style={{
                            position: 'absolute',
                            top: top,
                            left: left
                        }}>
                            <ActivityIndicator size='large' color={colors.activeTabColor}/>
                        </View>
                    }
                </View>
            }
            <FastImage
                {...this.props}
                style={[this.props.style, this.state.loaded ? {} : styles.hiddenImage]}
                onLoadEnd={this.onLoadEnd}
                onError={this.onError}
            />
        </View>;
    }
}

const styles = StyleSheet.create({
    hiddenImage: {
        width: 0,
        height: 0
    }
});