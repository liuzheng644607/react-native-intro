/**
* @Author: liuyany.liu <lyan>
* @Date:   2017-01-22 14:35:17
* @Last modified by:   lyan
* @Last modified time: 2017-01-22 14:36:15
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

import RootSiblings from './SiblingsManager';
const resolveAssetSource = require('resolveAssetSource');
import Rebound from 'rebound';

const {height, width, scale} = Dimensions.get('window');

class Button extends Component {
    render() {
        return (
            <View ref={(c) => this._refButton = c} style={buttonStyles.button}
             onTouchStart={(e) => this._onTouchStart(e)}
             onTouchEnd={(e) => this._onTouchEnd(e)}
             >
                <Text style={buttonStyles.text}>{this.props.children}</Text>
            </View>
        );
    }

    _onTouchStart(e) {
        /**
         * 这里直接操作style以达到效果
         * @type {Object}
         */
        this._refButton.setNativeProps({
            style: {backgroundColor: '#666'}
        });
    }

    _onTouchEnd() {
        this._refButton.setNativeProps({
            style: {backgroundColor: '#999'}
        });
    }
}

const buttonStyles = StyleSheet.create({
    button: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: '#999',
        borderRadius: 3
    },
    text: {
        color: '#fff'
    }
})

class MyImage extends Image {
    viewConfig = Object.assign({} , this.viewConfig, {
        validAttributes: Object.assign(
            {},
            this.viewConfig.validAttributes,
            {[Platform.OS === 'ios' ? 'source' : 'src']: true})
        });

    constructor() {
        super();
        this.setNativeProps = (props = {}) => {

            if (props.source) {
                const source = resolveAssetSource(props.source);
                let sourceAttr = Platform.OS === 'ios' ? 'source' : 'src';
                let sources;
                if (Array.isArray(source)) {
                    sources = source;
                } else {
                    sources = [source];
                }
                Object.assign(props, {[sourceAttr]: sources});
            }

            return super.setNativeProps(props);
        }
    }
}



export default class TouchTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            y: 0
        }
        this._refBox = null;
        this.pan = new Animated.ValueXY();
    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
              onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
              onMoveShouldSetPanResponder: (evt, gestureState) => true,
              onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (e, g) => {

            },
            onPanResponderMove: (e, g) => {
                this.pan.setValue({x:g.dx, y:g.dy})
            },
            onPanResponderRelease: (e, g) => {
                Animated.spring(
                   this.pan,
                   {toValue: {x: 0, y: 0}}
                 ).start();
            },
            onPanResponderTerminate: (e, g) => {

            },
            onStartShouldSetPanResponderCapture: (e, gestureState) => {
                return gestureState.dy > 8
            },
            onMoveShouldSetPanResponderCapture: (e, gestureState) => {
                return gestureState.dy > 8
            },
            onPanResponderTerminationRequest: (e, gestureState) => {
                return Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) > 20
            },
        });
    }

    render() {
        var box =  <View ref={(c) => this._refBox = c}>
            <Animated.Image
                ref={(c) => this._refImg = c}
                style={[styles.img, {
                    transform: [{translateX: this.pan.x, translateY: this.pan.y}]
                }]}
                source={{uri: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2478206899,4000352250&fm=80&w=179&h=119&img.JPEG'}} />
        </View>;
        return (
          <View style={styles.container} {...this._panResponder.panHandlers}>
            {box}
          </View>
        );
    }

    /**
     * 计算两个点的距离
     */
    _getDistance(xLen, yLen) {
        return Math.sqrt(xLen * xLen + yLen * yLen);
    }

    /**
     * 获取旋转方向
     */
    _getRotateDirection(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }

    /**
     * 旋转角度
     */
    _getRotateAngle(v1, v2) {
        let direction = this._getRotateDirection(v1, v2) > 0 ? -1 : 1,
            distance1 = this._getDistance(v1, v2),
            distance2 = this._getDistance(v)
    }

}
// class Point {
//     constructor() {
//         this.x = 0;
//         this.y = 0;
//     }
// }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  box: {
  },
  img: {
      width: 100,
      height: 100,
      borderRadius: 5,
      backgroundColor: 'rgba(233, 30, 99, 0.8)'
  },
  item: {
      height: 200,
      width:width
  },
  button: {
      marginTop: 50,
      padding: 12,
      borderRadius: 4,
      backgroundColor: '#999'
  }
});
