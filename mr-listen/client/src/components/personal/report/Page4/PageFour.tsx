import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './PageFour.less'
import './../Report.less'

interface IProp {
  longestDuration: number
}

/**
 * 报告页面第四页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageFour extends Component<IProp> {

  render() {
    let seconds = (this.props.longestDuration / 1000) >>> 0;
    let minutes = (seconds / 60) >>> 0;
    let reportInfo = minutes > 0
      ? (
        <View>
          <Text>你最久的一次</Text>
          <Text>
            <Text>絮絮地说了</Text>
            <Text>{minutes}</Text>
            <Text>分钟</Text>
          </Text>
          <Text>我听得也很开心</Text>
        </View>
      )
      : seconds
        ? (
          <View>
            <Text>你最久的一次</Text>
            <Text>
              <Text>也只说了</Text>
              <Text>{seconds}</Text>
              <Text>秒</Text>
            </Text>
            <Text>我还想多听听你的故事</Text>
          </View>
        )
        : (
          <View>
            <Text>你还没有向我倾诉过</Text>
            <Text>很想听听你的故事</Text>
          </View>
        )
    ;

    return (
      <View>
        {reportInfo}
      </View>
    );
  }
}
