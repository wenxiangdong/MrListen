import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './PageThree.less'
import './../Report.less'

interface IProp {
  holeCount: number
}

/**
 * 报告页面第三页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageThree extends Component<IProp> {

  render() {
    let reportInfo = this.props.holeCount
      ? (
        <View className={'report-info show-up'}>
          <Text>这么多天来</Text>
          <Text>
            <Text decode={true}>你的话语已经填满了整整&nbsp;</Text>
            <Text className={'strong-text'}>{this.props.holeCount}</Text>
            <Text decode={true}>&nbsp;个树洞</Text>
          </Text>
        </View>
      )
      : (
        <View className={'report-info show-up'}>
          <Text>你还没有倾诉过</Text>
          <Text>不过不用着急 慢慢来就好</Text>
          <Text>还有好多树洞等着被故事填满</Text>
        </View>
      );

    return (
      <View className={'base-page'}>
        {reportInfo}
      </View>
    );
  }
}
