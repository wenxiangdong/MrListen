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
    let dateTime = (hour > 12 ? '深夜' : '凌晨') + ' ';
    hour = hour > 12 ? hour - 12 : hour;
    let minute = latestDate.getMinutes();

    let reportInfo =
      this.props.latestTime
        ? (
          <View>
            <Text>你还记得你最晚的那次倾诉吗</Text>
            <Text>
              <Text>那是在</Text>
              <Text>{year}</Text>
              <Text>年</Text>
              <Text>{month}</Text>
              <Text>月</Text>
              <Text>{date}</Text>
              <Text>日</Text>
            </Text>
            <Text>
              <Text>{dateTime}</Text>
              <Text>{hour}</Text>
              <Text>点</Text>
              <Text>{minute}</Text>
              <Text>分</Text>
            </Text>
            <Text>还没有睡的你想起了我</Text>
          </View>
        )
        : (
          <View>
            <Text>你还没在很晚的时候向我倾诉过</Text>
            <Text>只是不管多晚</Text>
            <Text>我会都在这里安静倾听</Text>
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
