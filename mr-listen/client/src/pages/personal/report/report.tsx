import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import Logger from './../../../utils/logger'
import Listen from '../../../utils/listen'
import {apiHub} from '../../../apis/ApiHub'
import {ReportVO} from '../../../apis/ReportApi'

import './report.less'

interface IState {
  report: ReportVO
}

/**
 * 报告页面
 * TODO 添加词云
 * TODO 添加日期显示
 * TODO 添加分享
 * @author 张李承
 * @create 2019/4/22 23:26
 */
export class Report extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '倾诉报告'
  };

  private logger = Logger.getLogger(Report.name);

  componentWillMount() {
    Listen.showLoading('生成报告中');
    apiHub.reportApi.getReport()
      .then((report) => {
        console.log('fulfilled');
        this.setState({report});
        Listen.hideLoading();
      })
      .catch((e) => {
        console.log('rejected');
        this.logger.error(e);
        Listen.hideLoading();
        Listen.message.error('出错啦');
      });
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    let report = this.state.report;
    return (
      this.state.report
        ?
        <View>
          {/*<Text>我们自从 {new Date(report.meetTime)} 相遇，</Text>*/}
          <Text>你已经使用过 {report.holeCount} 个树洞，</Text>
          <Text>最长的一次你倾诉了 {report.longestDuration} 分钟，</Text>
          <Text>你最常使用的词语是 {report.mostUsedWords[0][0]}，</Text>
          {/*<Text>最晚的一次倾诉在 {new Date(report.latestTime)} 分钟，</Text>*/}
          <Text>你的分享已经被点赞了 {report.plusOneCount} 次</Text>
          <Text>继续努力吧</Text>
        </View>
        :
        null
    )
  }
}
