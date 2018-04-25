import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Animated,
} from 'react-native';

import React, { Component } from 'react';

const { width, height } = Dimensions.get('window');
const [CLIENT_WIDTH, CLIENT_HEIGHT] = [width, height];
let zIndex = 999;

export class IntroModal extends Component {
  constructor(props) {
    super(props);

    this.innerElement = null;
    this.currentStep = 1;

    this._aniWidth = new Animated.Value(0);
    this._aniHeight = new Animated.Value(0);
    this._aniLeft = new Animated.Value(0);
    this._aniTop = new Animated.Value(0);

    this._aniOpacity = new Animated.Value(0);

    this._aniStepNumLeft = new Animated.Value(0);
  }

  animateMove(obj = {}) {
    var duration = 300;

    var stepNumLeft = obj.left - 12;

    if (stepNumLeft < 0) {
      stepNumLeft = obj.left + obj.width - 12;
      if (stepNumLeft > CLIENT_WIDTH - 24) {
        stepNumLeft = CLIENT_WIDTH - 24;
      }
    }

    Animated.parallel([
      Animated.timing(this._aniWidth, {
        duration,
        toValue: obj.width,
      }),

      Animated.timing(this._aniHeight, {
        duration,
        toValue: obj.height,
      }),

      Animated.timing(this._aniLeft, {
        duration,
        toValue: obj.left,
      }),

      Animated.timing(this._aniTop, {
        duration,
        toValue: obj.top,
      }),

      Animated.timing(this._aniStepNumLeft, {
        duration,
        toValue: stepNumLeft,
      }),
    ]).start();

    var centerPoint = {
      x: obj.left + obj.width / 2,
      y: obj.top + obj.height / 2,
    };

    var relative2Left = centerPoint.x;
    var relative2Top = centerPoint.y;
    var relative2Bottom = Math.abs(centerPoint.y - CLIENT_HEIGHT);
    var relative2Right = Math.abs(centerPoint.x - CLIENT_WIDTH);

    var whereVerticalPlace = relative2Bottom > relative2Top ? 'bottom' : 'top';
    var whereHorizontalPlace =
      relative2Left > relative2Right ? 'left' : 'right';

    var margin = 13;
    var tooltip = {};
    var arrow = {};

    switch (whereVerticalPlace) {
      case 'bottom':
        tooltip.top = obj.top + obj.height + margin;
        arrow.borderBottomColor = '#fff';
        arrow.top = tooltip.top - margin + 3;
        break;

      case 'top':
        tooltip.bottom = CLIENT_HEIGHT - obj.top + margin;
        arrow.borderTopColor = '#fff';
        arrow.bottom = tooltip.bottom - margin + 3;
        break;
      default:
      // nothing todo
    }

    switch (whereHorizontalPlace) {
      case 'left':
        tooltip.right = Math.max(CLIENT_WIDTH - (obj.left + obj.width), 0);
        tooltip.right =
          tooltip.right === 0 ? tooltip.right + margin : tooltip.right;
        tooltip.maxWidth = CLIENT_WIDTH - tooltip.right - margin;
        arrow.right = tooltip.right + margin;
        break;

      case 'right':
        tooltip.left = Math.max(obj.left, 0);
        tooltip.left =
          tooltip.left === 0 ? tooltip.left + margin : tooltip.left;
        tooltip.maxWidth = CLIENT_WIDTH - tooltip.left - margin;
        arrow.left = tooltip.left + margin;
        break;
      default:
      // nothing todo
    }

    this.tooltip = tooltip;
    this.arrow = arrow;
  }

  toggleTooltip(isShow = true) {
    Animated.timing(this._aniOpacity, {
      toValue: isShow ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const { contentRender } = this.props;
    return (
      <View style={[styles.container, { zIndex }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.sibling]}
          onPress={this.props.stop}
        />
        <Animated.View
          ref={(c) => (this.refHilightBox = c)}
          style={[
            styles.hilightBox,
            { position: 'absolute' },
            {
              width: this._aniWidth,
              height: this._aniHeight,
              left: this._aniLeft,
              top: this._aniTop,
            },
          ]}
        />
        <View
          ref={(c) => (this.refContainer = c)}
          style={[styles.modalContent]}
        >
          {this.innerElement}
        </View>
        <Animated.View
          style={[
            styles.stepNum,
            { zIndex: zIndex + 1000 },
            {
              left: this._aniStepNumLeft,
              top: Animated.add(this._aniTop, -12),
            },
          ]}
        >
          <Text style={[styles.stepNumText]}>{this.currentStep}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.arrow, this.arrow, { opacity: this._aniOpacity }]}
        />
        {contentRender ? (
          <Animated.View
            style={[
              styles.toolTip,
              this.tooltip,
              { opacity: this._aniOpacity },
            ]}
          >
            {contentRender(this.content, this.currentStep)}
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.toolTip,
              this.tooltip,
              { opacity: this._aniOpacity },
            ]}
          >
            <View style={{ flex: 1 }}>{this.content || null}</View>
            <View style={[styles.introBar]}>
              <View
                style={[
                  styles.introButton,
                  {
                    borderColor: '#999',
                    marginRight: 20,
                  },
                ]}
                onTouchStart={() => this.props.stop()}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: '#999',
                    },
                  ]}
                >
                  OK
                </Text>
              </View>
              <View
                style={[styles.introButton]}
                onTouchStart={() => this.props.prev()}
              >
                <Text style={[styles.buttonText]}>prev</Text>
              </View>
              <View
                style={[styles.introButton, { marginLeft: 8 }]}
                onTouchStart={() => this.props.next()}
              >
                <Text style={[styles.buttonText]}>next</Text>
              </View>
            </View>
          </Animated.View>
        )}
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
    bottom: 0,
  },

  hilightBox: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 2,
  },

  arrow: {
    position: 'absolute',
    borderColor: 'transparent',
    borderWidth: 5,
  },

  up: {
    borderBottomColor: '#fff',
  },

  down: {
    borderTopColor: '#fff',
  },

  toolTip: {
    position: 'absolute',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
    overflow: 'hidden',
  },

  stepNum: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#fff',
    backgroundColor: '#28a3ef',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumText: {
    backgroundColor: 'rgba(255,255,255,0)',
    fontWeight: 'bold',
    color: '#fff',
  },

  sibling: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  introButton: {
    padding: 2,
    borderColor: '#28a3ef',
    borderWidth: 1,
    borderRadius: 2,
  },

  buttonText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#28a3ef',
  },

  introBar: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  modalContent: {
    position: 'absolute',
    overflow: 'hidden',
  },

  modal: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
