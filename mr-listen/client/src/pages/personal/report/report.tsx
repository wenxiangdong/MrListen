import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Image, OpenData} from '@tarojs/components'
import ShareCanvas from './../../../components/ShareCanvas/ShareCanvas'
import AppAvatar from './../../../components/common/AppAvatar/AppAvatar'

import Logger from './../../../utils/logger'
import Listen from '../../../utils/listen'
import {apiHub} from '../../../apis/ApiHub'
import {ReportVO} from '../../../apis/ReportApi'

import cancelPng from './../../../images/cancel.png';
import enterImg from './../../../images/enterImg.png';

import './../../../components/common/common-zlc.less'
import './report.less'
import {HttpResponse} from "../../../apis/HttpRequest";

interface IState {
  pageIndex: number,
  createShare: boolean,
}

/**
 * 报告页面
 * TODO 添加词云
 * TODO 添加分享
 * @author 张李承
 * @create 2019/4/22 23:26
 */
export class Report extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '倾诉报告',
    navigationBarBackgroundColor: '#1A237E',
    navigationBarTextStyle: 'white',
  };

  private logger = Logger.getLogger(Report.name);
  private report:ReportVO;
  private PAGE_COUNT = 8;

  private wordCloudSetting = [
    [],
    [{width: '700rpx', height: '500rpx', lineHeight: '500rpx'}],
    [
      {width: '600rpx', left: '125rpx', top: '250rpx', height: '400rpx', lineHeight: '400rpx'},
      {width: '400rpx', height: '300rpx', lineHeight: '300rpx'}
    ],
  ];

  componentWillMount() {
    Listen.showLoading('生成报告中')
      .then(() => {
        apiHub.reportApi.getReport()
          .then((report) => {
            this.logger.info('fulfilled');
            this.report = report;
            //TODO
            this.setState({pageIndex: 6, createShare: false});
            Listen.hideLoading();
          })
          .catch((e:HttpResponse<ReportVO>) => {
            this.logger.info('rejected');
            this.logger.error(e);
            Listen.hideLoading();
            Listen.message.error('出错啦');
          });
      });
  }

  private jumpToNextPage = () => {
    (this.state.pageIndex < this.PAGE_COUNT) &&
      this.setState({pageIndex: this.state.pageIndex + 1});
  };

  private returnTop = () => {
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

  private createHotTextStyleSetting = (originSetting, word) => {
    // TODO 添加 opacity
    let width = Number(originSetting.width.substring(0, originSetting.width.indexOf('rpx')));
    let height = Number(originSetting.height.substring(0, originSetting.height.indexOf('rpx')));
    return {
      ...originSetting,
      fontSize: `${(Math.min(width, height) / `${word}`.length) >>> 0}rpx`
    };
  };

  render() {
    let view;

    if (this.state.createShare) {
      // TODO
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
            <View className={'page-zero base-page'} onClick={this.jumpToNextPage}>
              {/*<Image className={'background-image'}*/}
                     {/*mode={'scaleToFill'}*/}
                     {/*src={this.backgroundImageArr[this.state.pageIndex]}/>*/}
              <View className={'user-info'}>
                <AppAvatar size={24} margin={10}/>
                <View className={'user-info-vertical-separator'}/>
                <OpenData className={'normal-text sm-margin user-data'} type={'userNickName'}/>
              </View>
              <View className={'title-info show-up'}>
                <Text className={'report-title-text'}>倾 诉 报 告</Text>
                <Text className={'app-name-text'}>Mr Listen</Text>
                <Text className={'app-intro-text'}>倾 听 你 的 一 切</Text>
              </View>
              <View className={'prompt-view'}>
                <Image className={'enter-img flashing'} src={enterImg}/>
                <Text className={'enter-text'}>点击进入</Text>
              </View>
            </View>
          );
          break;
        }
        case 1: {
          let meetDate = new Date(this.report.meetTime);
          let texts = this.getHourTexts(meetDate.getHours());

          view = (
            <View className={'page-one base-page'} onClick={this.jumpToNextPage}>
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
          );
          break;
        }
        case 2: {
          let holeCount = this.report.holeCount;
          let reportInfo = holeCount
            ? (
              <View className={'report-info show-up'}>
                <Text>这么多天来</Text>
                <Text>
                  <Text decode={true}>你的话语已经填满了整整&nbsp;</Text>
                  <Text className={'strong-text'}>{holeCount}</Text>
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

          view = (
            <View className={'page-two base-page'} onClick={this.jumpToNextPage}>
              {reportInfo}
            </View>
          );
          break;
        }
        case 3: {
          let seconds = (this.report.longestDuration / 1000) >>> 0;
          let minutes = (seconds / 60) >>> 0;
          let reportInfo = minutes > 0
            ? (
              <View className={'report-info show-up'}>
                <Text>你最久的一次</Text>
                <Text>
                  <Text decode={true}>絮絮地说了&nbsp;</Text>
                  <Text className={'strong-text'}>{minutes}</Text>
                  <Text decode={true}>&nbsp;分钟</Text>
                </Text>
                <Text>我听得也很开心</Text>
              </View>
            )
            : seconds
              ? (
                <View className={'report-info show-up'}>
                  <Text>你最久的一次</Text>
                  <Text>
                    <Text decode={true}>也只说了&nbsp;</Text>
                    <Text className={'strong-text'}>{seconds}</Text>
                    <Text decode={true}>&nbsp;秒</Text>
                  </Text>
                  <Text>我还想多听听你的故事</Text>
                </View>
              )
              : (
                <View className={'report-info show-up'}>
                  <Text>你还没有向我倾诉过</Text>
                  <Text>很想听听你的故事</Text>
                </View>
              )
          ;

          view = (
            <View className={'page-three base-page'} onClick={this.jumpToNextPage}>
              {reportInfo}
            </View>
          );
          break;
        }
        case 4: {
          let latestDate = new Date(this.report.latestTime);
          let year = latestDate.getFullYear();
          let month = latestDate.getMonth() + 1;
          let date = latestDate.getDate();
          let hour = latestDate.getHours();
          let dateTime = (hour > 5? '深夜':'凌晨') + ' ';
          hour = hour > 5? hour - 12: hour;
          let minute = latestDate.getMinutes();

          let reportInfo =
            this.report.latestTime
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

          view = (
            <View className={'page-four base-page'} onClick={this.jumpToNextPage}>
              {reportInfo}
            </View>
          );
          break;
        }
        case 5: {
          let shareHoleCount = this.report.shareHoleCount;
          let plusOneCount = this.report.plusOneCount;

          let reportInfo = shareHoleCount
              ? (
                <View className={'report-info show-up'}>
                  <Text>你喜欢分享</Text>
                  <Text>
                    <Text decode={true}>已经有&nbsp;</Text>
                    <Text className={'strong-text'}>{shareHoleCount}</Text>
                    <Text decode={true}>&nbsp;次分享树洞的经历</Text>
                  </Text>
                  <Text>
                    <Text decode={true}>你也在这其中收获了&nbsp;</Text>
                    <Text className={'strong-text'}>{plusOneCount}</Text>
                    <Text decode={true}>&nbsp;次点赞</Text>
                  </Text>
                </View>
              )
              : (
                <View className={'report-info show-up'}>
                  <Text>你还没有跟别人分享过树洞</Text>
                  <Text>这些都是我们的小秘密</Text>
                </View>
              )
          ;

          view = (
            <View className={'page-five base-page'} onClick={this.jumpToNextPage}>
              {reportInfo}
            </View>
          );
          break;
        }
        case 6: {
          let wordCount = this.report.mostUsedWords.length;

          // TODO
          let reportInfo =
            wordCount
            ? (
              <View className={'report-info show-up'}>
                <View className={'hot-word-view'}>
                  {this.report.mostUsedWords.map((config, idx) => {
                    let word = config[0];
                    let originSetting = this.wordCloudSetting[2][idx%2];
                    let setting = this.createHotTextStyleSetting(originSetting, word);
                    return (
                      <Text key={`word[0]${idx}`}
                            className={`hot-word`}
                            style={setting}
                      >
                        {word}
                      </Text>
                    )
                  })}
                </View>
                <Text className={'first-text'}>这么多天来</Text>
                <Text>我常常听你说到这些</Text>
              </View>
            )
            : (
              <View className={'report-info show-up'}>
                <Text>你的树洞空空如也</Text>
                <Text>它的主人神神秘秘</Text>
              </View>
            )
          ;

          view = (
            <View className={'page-six base-page'} onClick={this.jumpToNextPage}>
              {reportInfo}
            </View>
          );
          break;
        }
        case 7: {
          view = (
            <View className={'page-seven base-page'}>
              <View className={'user-greeting'}>
                <Text>Hi</Text>
                <OpenData className={'normal-text sm-margin user-data'} type={'userNickName'}/>
                <Text>:</Text>
              </View>
              <View className={'main-info show-up'}>
                <Text>不管是过去还是未来</Text>
                <Text>只要是你想说的</Text>
                <Text>都会认真倾听</Text>
                <Text decode={true}>祝&nbsp;天天开心</Text>
                <View className={'app-info-view'}>
                  <AppAvatar size={40} margin={10}/>
                  <View className={'app-info-vertical-separator'}/>
                  <View className={'right-info-view'}>
                    <Text className={'app-name-text'}>Mr Listen</Text>
                    <Text className={'app-intro-text'}>倾 听 你 的 一 切</Text>
                  </View>
                </View>
              </View>
              <View className={'prompt-view'}>
                <Button className={'enter-text'} onClick={this.returnTop}>再看一边</Button>
                <Button className={'enter-text'} onClick={this.createShare}>点击分享</Button>
              </View>
            </View>
          );
          break;
        }
      }
    }

    return (view);
  }
}
