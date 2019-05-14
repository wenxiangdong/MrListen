import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './PageFive.less'
import './../Report.less'

interface IProp {
  latestTime: number
}

/**
 * 报告页面第五页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageFive extends Component<IProp> {

  render() {
    let latestDate = new Date(this.props.latestTime);
    let year = latestDate.getFullYear();
    let month = latestDate.getMonth() + 1;
    let date = latestDate.getDate();
    let hour = latestDate.getHours();
    let dateTime = (hour > 12? '深夜':'凌晨') + ' ';
    hour = hour > 12? hour - 12: hour;
    let minute = latestDate.getMinutes();

    let reportInfo =
      this.props.latestTime
        ? (
          <View className={'report-info show-up'}>
            <Text>你还记得你最晚的那次倾诉吗</Text>
            <Text>
              <Text decode={true}>那是在&nbsp;</Text>
              <Text className={'strong-text'}>{year}</Text>
              <Text decode={true}>&nbsp;年&nbsp;</Text>
              <Text className={'strong-text'}>{month}</Text>
              <Text decode={true}>&nbsp;月&nbsp;</Text>
              <Text className={'strong-text'}>{date}</Text>
              <Text decode={true}>&nbsp;日</Text>
            </Text>
            <Text>
              <Text>{dateTime}</Text>
              <Text className={'strong-text'}>{hour}</Text>
              <Text decode={true}>&nbsp;点&nbsp;</Text>
              <Text className={'strong-text'}>{minute}</Text>
              <Text decode={true}>&nbsp;分&nbsp;</Text>
            </Text>
            <Text>还没有睡的你想起了我</Text>
          </View>
        )
        : (
          <View className={'report-info show-up'}>
            <Text>你还没在很晚的时候向我倾诉过</Text>
            <Text>只是不管多晚</Text>
            <Text>我会都在这里安静倾听</Text>
          </View>
        )
    ;

    return (
      <View className={'base-page'}>
        {reportInfo}
      </View>
    );
  }
}
