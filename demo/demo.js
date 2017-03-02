/**
* @Author: liuyany.liu <lyan>
* @Date:   2017-02-27 19:21:32
* @Last modified by:   lyan
* @Last modified time: 2017-03-02 20:43:49
*/

import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import React, {
    Component
} from 'react';

import Intro, { intro } from 'react-native-intro';

export default class Example extends Component {
    state = {
        value: 'hahah'
    }
    render() {
        return (
          <View style={styles.container}>
              <Intro style={[styles.content]}
                  content="这是啥"
                  group="test1"
                  step={1}
              >
                  <TextInput
                      style={{borderWidth: 1, height: 44}}
                      onChangeText={(v) => this.setState({value: v})}
                      value={this.state.value}/>
                      <Intro style={{top: 200, left: 100, position: 'absolute'}}
                          group="test1"
                          content={
                              <View style={{alignItems: 'center'}}>
                                    <Image source={{uri: 'https://dn-coding-net-production-static.qbox.me/static/7a51352fa766f4176d7c4543339e0e98.png'}}
                                    style={{width: 100, height: 100}}></Image>
                              </View>
                          }
                          step={2}>
                          <Text>呵呵呵呵</Text>
                      </Intro>
              </Intro>
              <Intro style={{top: 400, left: 0, position: 'absolute'}}
               group="test1"
               content="红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框红色方框"
               step={3}>
                <View style={{width: 400, height: 100, backgroundColor: '#ff0000'}}>

                </View>
              </Intro>
              <Intro
                  group="test1"
                  step={4}
                  content="点击我！"
                  style={[styles.button, {position: 'absolute'}]}
                  >
                      <TouchableOpacity onPress={ this._showModal.bind(this)}><Text>点我</Text></TouchableOpacity>

              </Intro>
          </View>
        );
    }

    componentDidMount() {
        this.intro = intro({group: 'test1'});
    }

    _showModal() {
        this.intro.start();
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
  content: {
      width: 200,
      height: 300,
      position: 'absolute',
      top: 100,
      left: 100,
      borderWidth: 1,
      borderColor: 'red'
  },
  button: {
    width: 100,
    height: 44,
    position: 'absolute',
    bottom: 100
  },
});
