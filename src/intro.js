/**
* @Author: liuyany.liu <lyan>
* @Date:   2017-02-07 15:45:15
* @Last modified by:   lyan
* @Last modified time: 2017-02-23 19:49:32
*/

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

import EventEmitter from 'EventEmitter';
import RootSiblings from './SiblingsManager';

export default class Example extends Component {
    state = {
        value: 'hahah'
    }
    render() {
        return (
          <View style={styles.container}>
              <Intro style={[styles.content]}
                  group="test1"
                  content="哈哈哈哈这里是新手引导"
                  disable={false}
                  step={1}
              >
                  <TextInput
                      style={{borderWidth: 1, height: 44}}
                      onChangeText={(v) => this.setState({value: v})}
                      value={this.state.value}/>
                      <Intro style={{top: 200, left: 100, position: 'absolute'}}
                          group="test1"
                          content="哈哈哈哈这里是新手引导"
                          disable={false}
                          step={2}>
                          <Text>呵呵呵呵</Text>
                      </Intro>
              </Intro>
              <Intro style={{top: 400, left: 100, position: 'absolute'}}
               group="test1"
               content="哈哈哈哈这里是新手引导"
               disable={false}
               step={3}>
                <View style={{width: 100, height: 100, backgroundColor: '#ff0000'}}>

                </View>
              </Intro>
              <Intro
                  group="test1"
                  step={4}
                   style={[styles.button, {position: 'absolute'}]}
                  >
                      <TouchableOpacity onPress={ this._showModal.bind(this)}><Text>点我</Text></TouchableOpacity>

              </Intro>
          </View>
        );
    }

    componentDidMount() {
        this.intro = intro('test1');
    }

    _showModal() {
        this.intro.start();
    }
}


var sibling;
var groupMap = {};
var DEFAULT_GROUP = 'DEFAULT_GROUP';

class Intro extends Component {
    setNativeProps(obj) {
        this._refIntro.setNativeProps(obj);
    }
    componentDidMount() {
        const { group, step, content, disable } = this.props;

        if (!groupMap[group || DEFAULT_GROUP]) {
            groupMap[group || DEFAULT_GROUP] = {};
        }

        let groupA = groupMap[group || DEFAULT_GROUP];

        if (!groupA[step]) {
            groupA[step] = {
                content,
                disable,
                target: this,
                refTarget: this._refIntro
            };
        }
    }

    measure() {
        this._refIntro.measure.apply(this._refIntro, arguments)
    }

    componentWillUnmount() {
        const { group, step, content, disable } = this.props;
        //
        // delete groupMap[group || DEFAULT_GROUP][step];
        //
        // if (Object.keys(groupMap[group || DEFAULT_GROUP]).length === 0) {
        //     delete groupMap[group && DEFAULT_GROUP];
        // }
    }
    render() {
        this.html = (
            <TouchableOpacity activeOpacity={1} {...this.props} ref={c => this._refIntro = c}>
                {this.props.children}
            </TouchableOpacity>
        );
        return this.html
    }
}

var hilightBox = null;
var refHilightBox;
var zIndex  = 99999;

function intro(g = DEFAULT_GROUP) {
    // 1 拿出分组数据
    var group   = groupMap[g];
    var stepArr = Object.keys(group).sort();
    var len     = stepArr.length;
    var index   = 0;
    var refContainer;
    var target;
    var refTarget;
    var element;
    var refModal;
    var retn = { start, stop };

    /**
     * 开始
     * @return {[type]} [description]
     */
    function start() {
        if (!sibling) {
            sibling = new RootSiblings(
                <IntroModal
                     ref={(c) => refModal = c}
                     next={next}
                     prev={prev}
                     stop={stop}
                  />
            );
        }

        setTimeout(() => {
            toStep(index);
        });
    }

    /**
     * 结束
     * @return {[type]} [description]
     */
    function stop() {
        sibling.destroy();
        sibling = null;
        index = 0;
    }

    /**
     * 下一步
     * @return {Function} [description]
     */
    function next() {
        if (index >= len - 1) return;

        index++;
        toStep(index);
    }

    /**
     * 上一步
     * @return {[type]} [description]
     */
    function prev() {
        if (index <= 0) return;

        index--;
        toStep(index);
    }

    /**
     * 跳到某一步
     * @return {[type]} [description]
     */
    function toStep(index) {

        target = group[stepArr[index]].target;
        refTarget = group[stepArr[index]].refTarget;
        element = target.html;
        element = cloneElement(element, {
            style: [element.props.style, {position: 'absolute',left: 0, top: 0}]
        });
        refModal.innerElement = null;
        refModal.forceUpdate();
        new Promise((resolve, reject) => {
            refTarget.measure((x, y, width, height, pageX, pageY) => {
                resolve({ x, y, width, height, pageX, pageY });
            }, () => reject);
        })
        .then((res) => {

            let obj = {
                width: res.width,
                height: res.height,
                left: res.pageX,
                top: res.pageY
            };

            setTimeout(() => {
                refModal.innerElement = element;
                refModal.currentStep = index+1;
                refModal.forceUpdate(() => {
                    refModal.refContainer.setNativeProps({
                        style: obj
                    });
                });
            }, 300)

            var offsetW = 4;
            refModal.animateMove({
                width: res.width + offsetW,
                height: res.height + offsetW,
                left: res.pageX - offsetW/2,
                top: res.pageY - offsetW/2
            })
        })



    }

    return retn;
}

class IntroModal extends Component {
    constructor(props) {
        super(props);

        this.innerElement = null;
        this.currentStep = 1;

        this._aniWidth = new Animated.Value(0);
        this._aniHeight = new Animated.Value(0);
        this._aniLeft = new Animated.Value(100);
        this._aniTop = new Animated.Value(100);
    }

    animateMove(obj = {}) {
        var duration = 300;
        Animated.parallel([
            Animated.timing(this._aniWidth, {
                duration,
                toValue: obj.width
            }),
            Animated.timing(this._aniHeight, {
                duration,
                toValue: obj.height
            }),
            Animated.timing(this._aniLeft, {
                duration,
                toValue: obj.left
            }),
            Animated.timing(this._aniTop, {
                duration,
                toValue: obj.top
            })
        ]).start()
    }

    render() {
        return (
            <View style={[styles.container, {zIndex}]}>
                <TouchableOpacity activeOpacity={0.8} style={[styles.sibling]} onPress={this.props.stop}/>
                <Animated.View ref={(c) => this.refHilightBox = c}
                    style={[styles.hilightBox, {position: 'absolute'}, {
                        width: this._aniWidth,
                        height: this._aniHeight,
                        left: this._aniLeft,
                        top: this._aniTop
                    }]}>
                </Animated.View>
                <View ref={(c) => this.refContainer = c }
                    style={[styles.modalContent]}
                    >
                        {this.innerElement}
                </View>
                <Animated.View style={[styles.stepNum, {zIndex: zIndex+1000}, {
                    left: Animated.add(this._aniLeft, -12),
                    top: Animated.add(this._aniTop, -12)
                }]}>
                    <Text style={[styles.stepNumText]}>{this.currentStep}</Text>
                </Animated.View>
                <View style={{top: 300, position: 'absolute'}} onTouchStart={() => this.props.prev()}>
                    <Text>上一个</Text>
                </View>
                <View style={{top: 400, position: 'absolute'}} onTouchStart={() => this.props.next()}>
                    <Text>下一个</Text>
                </View>
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
  },
  hilightBox: {
      position: 'absolute',
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderRadius: 2,
  },
  content: {
      width: 200,
      height: 300,
      position: 'absolute',
      top: 100,
      left: 100,
      borderWidth: 1,
      borderColor: 'red'
  },
  stepNum: {
      position: 'absolute',
      width: 24,
      height: 24,
      borderWidth: 2,
      borderRadius: 12,
      borderColor: '#fff',
      backgroundColor: "#28a3ef",
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center'
  },
  stepNumText: {
      backgroundColor: 'none',
      fontWeight: 'bold',
      color: '#fff'
  },
  sibling: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)'
  },
  button: {
    width: 100,
    height: 44,
    position: 'absolute',
    bottom: 100
  },
  modalContent: {
      position: 'absolute',
      overflow: 'hidden'
  },
  modal: {
      backgroundColor: 'rgba(0,0,0,0.5)',
  }
});
