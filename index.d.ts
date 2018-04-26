import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ComponentClass, Component } from 'react';

interface IIntroComponentProps {
  /**
   * 分组
   */
  group?: string;

  /**
   * 第几步
   */
  step: number;

  /**
   * 展示内容
   */
  content?: JSX.Element;

  /**
   * 样式
   */
  style?: StyleProp<ViewStyle>;
}

export declare class Intro extends Component<IIntroComponentProps> {}

export interface IntroManageOptions {
  /**
   * 当前分组
   */
  group?: string;

  /**
   * 循环
   */
  loop?: boolean;

  /**
   * 初始step 索引
   */
  startIndex?: number;

  /**
   * 是否显示步骤数， 默认true
   */
  showStepNumber?: boolean;

  /**
   * 蒙层的样式，可以定义透明度，背景颜色等
   */
  maskStyle?: StyleProp<ViewStyle>;

  /**
   * 高亮的内容区域是否可交互，用于防止用户点击在高亮内容上面
   */
  touchable?: boolean;

  /**
   * 点击蒙层是否关闭
   */
  maskClosable?: boolean;

  /**
   * 自定义渲染提示内容
   */
  contentRender?: (content: JSX.Element, step: number) => JSX.Element;
}

export declare class IntroManage {
  constructor(opts: IntroManageOptions);
  /**
   * 开始
   */
  start(): void;

  /**
   * 结束
   */
  stop(): void;

  /**
   * next step
   */
  next(): void;

  /**
   * previous step
   */
  prev(): void;

  /**
   * go to step direct (index)
   * @param index 
   */
  private toStep(index: number): void;
}

export default Intro;
