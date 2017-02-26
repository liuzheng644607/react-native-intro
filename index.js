/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @includeModules QImageSet,QFontSet
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  TouchableOpacity,
  cloneElement,
  Text,
  View,
  Platform,
  Image,
  ScrollView,
  Dimensions,
  PanResponder,
  TextInput,
  Animated
} from 'react-native';

// import Calendar from './src/calendar';
import IntroDemo from './src/intro.js';

class qrnTest extends Component {
    render() {
        return (
          <View style={styles.container}>
              <IntroDemo />
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom:0,
    paddingVertical: 64,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('bnbrn', () => qrnTest);
