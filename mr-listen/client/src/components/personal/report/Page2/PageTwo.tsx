import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './PageTwo.less'
import './../Report.less'

interface IProp {
  meetTime: number
}

/**
 * 报告页面第二页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageTwo extends Component<IProp> {

  private getHourTexts = (hour) => {
    let texts = ['', ''];

    if (hour < 4 || hour > 22) {
      if (hour < 4) {
        texts[0] = `清晨的 ${hour} 点我们相遇`;
      } else {
        texts[0] = `深夜里的 ${hour} 点我们相遇`;
      }
      texts[1] = `之后每个睡不着的夜里都会有我陪你`;
    } else if (hour < 8) {
      texts[0] = `清晨`;
      texts[1] = `我们相约遇见 ${hour} 点的太阳`;
    } else if (hour < 12) {
      texts[0] = `早晨 ${hour} 点`;
      texts[1] = `道过早安 一起努力到正午`;
    } else if (hour < 14) {
      texts[0] = `中午的 ${hour - 12} 点`;
      texts[1] = `午饭后要小憩一会儿吗`;
    } else if (hour < 17) {
      texts[0] = `下午的 ${hour - 12} 点`;
      texts[1] = `道过午安 等太阳落山`;
    } else if (hour < 19) {
      texts[0] = `傍晚的 ${hour - 12} 点`;
      texts[1] = `一天快要过去了`;
    } else {
      texts[0] = `夜晚的 ${hour - 12} 点`;
      texts[1] = `早点休息 晚安`;
    }

    return texts;
  };

  render() {
    let meetDate = new Date(this.props.meetTime);
    let texts = this.getHourTexts(meetDate.getHours());

    return (
      <View className={'base-page'}>
        <View className={'report-info show-up'} style={{top: '100rpx'}}>
          <Text>还记得 我们的初次相遇</Text>
          <Text style={{marginBottom: '60rpx'}}>
            <Text decode={true}>那是在&nbsp;</Text>
            <Text className={'strong-text'}>{meetDate.getFullYear()}</Text>
            <Text decode={true}>&nbsp;年的&nbsp;</Text>
            <Text className={'strong-text'}>{meetDate.getMonth() + 1}</Text>
            <Text decode={true}>&nbsp;月</Text>
          </Text>
          <Text>{texts[0]}</Text>
          <Text>{texts[1]}</Text>
        </View>
      </View>
    )
  }
}
