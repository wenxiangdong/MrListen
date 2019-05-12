import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Image, OpenData} from '@tarojs/components'
import ShareCanvas from './../../../components/ShareCanvas/ShareCanvas'
import UserAvatar from './../../../components/common/UserAvator/UserAvatar'

import Logger from './../../../utils/logger'
import Listen from '../../../utils/listen'
import {apiHub} from '../../../apis/ApiHub'
import {ReportVO} from '../../../apis/ReportApi'

import cancelPng from './../../../images/cancel.png';
import audio from './../../../images/audio.png';
import clock from './../../../images/clock.png';
import dust from './../../../images/dust.png';
import failed from './../../../images/failed.png';
import home from './../../../images/home.png';

import './../../../components/common/common-zlc.less'
import './report.less'

interface IState {
  pageIndex: number,
  createShare: boolean,
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
  private report;
  private PAGE_COUNT = 6;

  private backgroundArray = [
    cancelPng,
    audio,
    clock,
    dust,
    failed,
    home
  ];

  componentWillMount() {
    Listen.showLoading('生成报告中');
    apiHub.reportApi.getReport()
      .then((report) => {
        this.logger.info('fulfilled');
        this.report = report;
        this.setState({pageIndex: 0, createShare: false});
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
    (this.state.pageIndex < this.PAGE_COUNT) &&
      this.setState({pageIndex: this.state.pageIndex + 1});
  };

  private returnTop = () => {
    this.logger.info('returnTop');
    this.setState({pageIndex: 0});
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
    let view ;

    if (this.state.createShare) {
      view = (
        <View className={'share-code-wrapper'}>
          <ShareCanvas text={''} holeId={''} expireIn={0} onError={this.handleShareCancel}/>
          <Image className={'share-cancel-icon'} src={cancelPng} onClick={this.handleShareCancel}/>
        </View>
      );
    } else {
      switch (this.state.pageIndex) {
        case 0: {
          view = (
            <View>
              <View className={'user-info'}>
                <UserAvatar size={24} margin={10}/>
                <View className={'user-info-vertical-separator'}/>
                <OpenData className={'normal-text sm-margin user-data'} type={"userNickName"}/>
              </View>
            </View>
          )
        }
      }
    }

    // let reportView;
    // if (this.report) {
    //   let report = this.report;
    //   let sysInfo = Taro.getSystemInfoSync();
    //   let marginTop = sysInfo.windowHeight * this.state.pageIndex;
    //
    //   let meetTime = new Date(report.meetTime);
    //
    //   reportView = (
    //     <View className={'base-view'} onClick={this.jumpToNextPage}>
    //       <View className={'report-scroll-view'} style={{marginTop: `-${marginTop}px`}}>
    //         <View className={'report-view'} style={{backgroundImage: `url(${this.backgroundArray[0]})`}}>
    //           😂我们自从 {new Date(report.meetTime).toLocaleString()} 相遇，
    //         </View>
    //         <View className={'report-view'} style={{backgroundImage: `url(${this.backgroundArray[1]})`}}>😎你已经使用过 {report.holeCount} 个树洞，</View>
    //         <View className={'report-view'} style={{backgroundImage: `url(${this.backgroundArray[2]})`}}>最长的一次你倾诉了 {report.longestDuration} 分钟，</View>
    //         <View className={'report-view'} style={{backgroundImage: `url(${this.backgroundArray[3]})`}}>最晚的一次倾诉在 {new Date(report.latestTime).getMinutes()} 分钟，</View>
    //         <View className={'report-view'} style={{backgroundImage: `url(${this.backgroundArray[4]})`}}>你的分享已经被点赞了 {report.plusOneCount} 次</View>
    //         <View className={'report-view'} style={{backgroundImage: `url(${this.backgroundArray[5]})`}}>你最常使用的词语是 {report.mostUsedWords[0][0]}，</View>
    //         <View className={'report-view'}>继续努力吧</View>
    //       </View>
    //       {
    //         this.state.pageIndex < this.PAGE_COUNT
    //           ?
    //           <View className={'bottom-cover-view'}>
    //             <Text>点击查看下一页</Text>
    //           </View>
    //           :
    //           <View className={'bottom-cover-view'}>
    //             <Button type={'primary'} onClick={this.returnTop}>再看一遍</Button>
    //             <Button type={'primary'} plain={true} onClick={this.createShare}>创建分享</Button>
    //           </View>
    //       }
    //     </View>
    //   );
    // }

    return (view);
  }
}
