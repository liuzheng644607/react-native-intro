/**
 * @Author: liuyany.liu <lyan>
 * @Date:   2017-02-07 15:45:15
 * @Last modified by:   lyan
 * @Last modified time: 2017-03-02 20:54:24
 */

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Animated
} from "react-native";
import React, { cloneElement, Component } from "react";
import RootSiblings from "react-native-root-siblings";
import {IntroModal} from './IntroModal';
import {groupMap, DEFAULT_GROUP, DEFAULTOPTIONS} from './constants';

const offsetW = 4;

export class IntroManage {
  constructor(opts = {}) {
    opts = this.opts = Object.assign({}, DEFAULTOPTIONS, opts);
    this.groupName = opts.group;
    this.introData = groupMap[this.groupName];
    if (!this.introData) {
      return;
    }

    this.loop = opts.loop;

    this.stepArr = Object.keys(this.introData).sort();
    this.stepLength = this.stepArr.length;
    this.index = 0;
    this.timer = null;
    this.stepTimer = null;

    this.refModal = null;
    this.sibling = null;
  }

  start = () => {
    if (!this.sibling) {
      this.sibling = new RootSiblings(
        (
          <IntroModal
            ref={c => (this.refModal = c)}
            next={this.next}
            prev={this.prev}
            stop={this.stop}
            contentRender={this.opts.contentRender}
          />
        )
      );
    }
    this.cleartTimers();
    stepTimer = setTimeout(() => {
      this.toStep(this.index);
    });
  }

  stop = () => {
    this.cleartTimers();
    if (this.sibling) {
      this.sibling.destroy();
      this.sibling = null;
    }
    this.index = 0;
  }

  prev = () => {
    
    if (this.index <= 0) {
      if (this.loop) {
        this.index = this.stepLength;
      } else {
        return;
      }
    }

    this.index--;
    this.toStep(this.index);
  }

  next = () => {
    if (this.index >= this.stepLength - 1) {
      if (this.loop) {
        this.index = -1;
      } else {
        return;
      }
    }

    this.index++;
    this.toStep(this.index);
  }

  toStep = (index) => {
    const currentStep = this.introData[this.stepArr[index]];
    const content = currentStep.content;

    const target = currentStep.target;
    const refTarget = currentStep.refTarget;

    let element = target.html;
    element = cloneElement(element, {
      style: [element.props.style]
    });

    const refModal = this.refModal;

    this.refModal.innerElement = null;
    this.refModal.forceUpdate();

    new Promise((resolve, reject) => {
      refTarget.measure((x, y, width, height, pageX, pageY) => {
        resolve({ x, y, width, height, pageX, pageY });
      }, () => reject);
    }).then(res => {
      let obj = {
        width: res.width,
        height: res.height,
        left: res.pageX,
        top: res.pageY
      };
      // hide the tooltip
      refModal.toggleTooltip(false);

      timer = setTimeout(() => {
        refModal.innerElement = element;
        refModal.currentStep = index + 1;
        refModal.content =
          typeof content === "string" ? (
            <View>
              <Text>{content}</Text>
            </View>
          ) : (
            content
          );
        refModal.forceUpdate(() => {
          refModal.refContainer.setNativeProps({
            style: obj
          });
        });
        refModal.toggleTooltip(true);
      }, 300);

      refModal.animateMove({
        width: res.width + offsetW,
        height: res.height + offsetW,
        left: res.pageX - offsetW / 2,
        top: res.pageY - offsetW / 2
      });
    });
  }

  cleartTimers = () => {
    clearTimeout(this.stepTimer);
    clearTimeout(this.timer);
  }
}
