import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Image} from '@tarojs/components'
import ShareCanvas from './../../../components/ShareCanvas/ShareCanvas'

import Logger from './../../../utils/logger'
import Listen from '../../../utils/listen'
import {apiHub} from '../../../apis/ApiHub'
import {ReportVO} from '../../../apis/ReportApi'

import cancelPng from './../../../images/cancel.png';

import './../../../components/common/common-zlc.less'
import './report.less'

interface IState {
  report: ReportVO,
  index: number,
  createShare: boolean
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
  private PAGE_COUNT = 6;

  componentWillMount() {
    Listen.showLoading('生成报告中');
    apiHub.reportApi.getReport()
      .then((report) => {
        this.logger.info('fulfilled');
        this.setState({report, index: 0, createShare: false});
        Listen.hideLoading();
      })
      .catch((e) => {
        this.logger.info('rejected');
        this.logger.error(e);
        Listen.hideLoading();
        Listen.message.error('出错啦');
      });
  }

  private jumpToNextPage = () => {
    this.logger.info('next page');
    (this.state.index < this.PAGE_COUNT) &&
      this.setState({index: this.state.index + 1});
  };

  private returnTop = () => {
    this.logger.info('returnTop');
    this.setState({index: 0});
  };

  private createShare = () => {
    this.logger.info('createShare');
    this.setState({createShare: true});
  };

  private handleShareCancel = () => {
    this.logger.info('handleShareCancel');
    this.setState({createShare: false});
  };

  render() {
    let shareView;

    if (this.state.createShare) {
      shareView = (
        <View className={'share-code-wrapper'}>
          <ShareCanvas text={''} holeId={''} expireIn={0} onError={this.handleShareCancel}/>
          <Image className={'share-cancel-icon'} src={cancelPng} onClick={this.handleShareCancel}/>
        </View>
      );
    }

    let reportView;
    if (this.state.report) {
      let report = this.state.report;
      let sysInfo = Taro.getSystemInfoSync();
      let marginTop = sysInfo.windowHeight * this.state.index;

      reportView = (
        <View className={'base-view'} onClick={this.jumpToNextPage}>
          <View className={'report-scroll-view'} style={{marginTop: `-${marginTop}px`}}>
            <View className={'report-view'}>我们自从 {new Date(report.meetTime).toLocaleString()} 相遇，</View>
            <View className={'report-view'}>你已经使用过 {report.holeCount} 个树洞，</View>
            <View className={'report-view'}>最长的一次你倾诉了 {report.longestDuration} 分钟，</View>
            <View className={'report-view'}>最晚的一次倾诉在 {new Date(report.latestTime).getMinutes()} 分钟，</View>
            <View className={'report-view'}>你的分享已经被点赞了 {report.plusOneCount} 次</View>
            <View className={'report-view'}>你最常使用的词语是 {report.mostUsedWords[0][0]}，</View>
            <View className={'report-view'}>继续努力吧</View>
          </View>
          {
            this.state.index < this.PAGE_COUNT
              ?
              <View className={'bottom-cover-view'}>
                <Text>点击查看下一页</Text>
              </View>
              :
              <View className={'bottom-cover-view'}>
                <Button type={'primary'} onClick={this.returnTop}>再看一遍</Button>
                <Button type={'primary'} plain={true} onClick={this.createShare}>创建分享</Button>
              </View>
          }
        </View>
      );
    }

    return (
      this.state.createShare
        ? shareView
        : (
          this.state.report
            ? reportView
            : null
        )
    )
  }
}
