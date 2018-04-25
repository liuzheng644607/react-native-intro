import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Animated
} from "react-native";

import React, { Component } from "react";
import {groupMap, DEFAULT_GROUP} from './constants';

export class Intro extends Component {
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
        refTarget: this._refIntro,
        _index: 0
      };
    } else {
      ++groupA[step]._index;
    }
  }

  measure() {
    this._refIntro.measure.apply(this._refIntro, arguments);
  }

  componentWillUnmount() {
    const { group, step, content, disable } = this.props;
    var groupA = groupMap[group || DEFAULT_GROUP][step];

    if (groupA._index > 0) {
      --groupA._index;
    } else {
      delete groupMap[group || DEFAULT_GROUP][step];
      if (Object.keys(groupMap[group || DEFAULT_GROUP]).length === 0) {
        delete groupMap[group && DEFAULT_GROUP];
      }
    }
  }

  render() {
    this.html = (
      <View
        {...this.props}
        ref={c => (this._refIntro = c)}
      >
        {this.props.children}
      </View>
    );

    return this.html;
  }
}
