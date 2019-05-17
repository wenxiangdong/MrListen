import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './PageSix.less'
import './../Report.less'

interface IProp {
  shareHoleCount: number,
  plusOneCount: number
}

/**
 * 报告页面第六页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageSix extends Component<IProp> {

  render() {
    let shareHoleCount = this.props.shareHoleCount;
    let plusOneCount = this.props.plusOneCount;

    let reportInfo = shareHoleCount
      ? (
        <View>
          <Text>你喜欢分享</Text>
          <Text>
            <Text>已经有</Text>
            <Text>{shareHoleCount}</Text>
            <Text>次分享树洞的经历</Text>
          </Text>
          <Text>
            <Text>你也在这其中收获了</Text>
            <Text>{plusOneCount}</Text>
            <Text>次点赞</Text>
          </Text>
        </View>
      )
      : (
        <View>
          <Text>你还没有跟别人分享过树洞</Text>
          <Text>这些都是我们的小秘密</Text>
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
