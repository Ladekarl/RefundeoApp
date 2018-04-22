import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import colors from './shared/colors';
import {
  setCustomActivityIndicator,
  setCustomText,
  setCustomTextInput,
  setCustomTouchableOpacity,
} from 'react-native-global-props';
import AppNavigation from './navigation/AppNavigation';

export default class App extends Component {

  constructor(props) {
    super(props);

    const customTextProps = {
      style: {
        fontFamily: 'Lato'
      }
    };
    const customTouchableOpacityProps = {
      hitSlop: {top: 15, right: 15, left: 15, bottom: 15}
    };
    const customActivityIndicator = {
      color: colors.inactiveTabColor
    };

    setCustomText(customTextProps);
    setCustomTouchableOpacity(customTouchableOpacityProps);
    setCustomActivityIndicator(customActivityIndicator);
    setCustomTextInput(customTextProps);
  }

  render() {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    }
    return (
      <View style={styles.container}>
        <AppNavigation/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  }
});