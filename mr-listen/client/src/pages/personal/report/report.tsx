import Taro, {Component, Config} from '@tarojs/taro'
import {Button, Image, OpenData, Text, View} from '@tarojs/components'
import AppAvatar from './../../../components/common/AppAvatar/AppAvatar'

import Logger from './../../../utils/logger'
import Listen from '../../../utils/listen'
import {apiHub} from '../../../apis/ApiHub'
import {ReportVO} from '../../../apis/ReportApi'

import enterImg from './../../../images/enterImg.png';

import './../../../components/common/common-zlc.less'
import './report.less'
import {HttpCode, HttpResponse} from "../../../apis/HttpRequest";

interface IState {
  pageIndex: number,
  notFound: boolean
}

/**
 * 报告页面
 * TODO 添加背景图片
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
    [{width: '700rpx', height: '500rpx'}],
    [
      {width: '600rpx', height: '300rpx', left: '125rpx', top: '350rpx'},
      {width: '400rpx', height: '200rpx'}
    ],
    [
      {width: '400rpx', height: '500rpx', left: '325rpx'},
      {width: '300rpx', height: '300rpx', top: '350rpx'},
      {width: '300rpx', height: '200rpx'}
    ],
    [
      {width: '400rpx', height: '400rpx', left: '325rpx', top: '250rpx'},
      {width: '300rpx', height: '300rpx', top: '350rpx'},
      {width: '300rpx', height: '100rpx', left: '325rpx'},
      {width: '200rpx', height: '200rpx', left: '125rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '400rpx'},
      {width: '100rpx', height: '400rpx', left: '625rpx', top: '250rpx'},
      {width: '600rpx', height: '100rpx', top: '550rpx'},
      {width: '500rpx', height: '100rpx', left: '225rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '400rpx', top: '250rpx'},
      {width: '500rpx', height: '100rpx', left: '225rpx', top: '550rpx'},
      {width: '400rpx', height: '100rpx', left: '325rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'},
      {width: '300rpx', height: '100rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '300rpx', top: '250rpx'},
      {width: '400rpx', height: '100rpx', left: '325rpx', top: '550rpx'},
      {width: '400rpx', height: '100rpx', left: '325rpx'},
      {width: '300rpx', height: '100rpx', top: '550rpx'},
      {width: '300rpx', height: '100rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '300rpx', top: '250rpx'},
      {width: '400rpx', height: '100rpx', left: '325rpx', top: '550rpx'},
      {width: '300rpx', height: '100rpx', left: '225rpx'},
      {width: '300rpx', height: '100rpx', top: '550rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx'},
      {width: '200rpx', height: '100rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '300rpx', top: '250rpx'},
      {width: '300rpx', height: '100rpx', left: '225rpx', top: '550rpx'},
      {width: '300rpx', height: '100rpx', left: '225rpx'},
      {width: '200rpx', height: '100rpx', top: '550rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx', top: '550rpx'},
      {width: '200rpx', height: '100rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '300rpx', top: '250rpx'},
      {width: '300rpx', height: '100rpx', left: '225rpx', top: '550rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'},
      {width: '200rpx', height: '100rpx', top: '550rpx'},
      {width: '200rpx', height: '100rpx', left: '325rpx'},
      {width: '200rpx', height: '100rpx', left: '125rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx', top: '550rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx'},
      {width: '100rpx', height: '100rpx'}
    ]
  ];

  componentWillMount() {
    Listen.showLoading('生成报告中')
      .then(() => {
        apiHub.reportApi.getReport()
          .then((report) => {
            this.report = report;
            this.setState({pageIndex: 0});
            Listen.hideLoading();
          })
          .catch((e:HttpResponse<ReportVO>) => {
            this.logger.error(e);
            Listen.hideLoading();
            switch (e.code) {
              case HttpCode.NOT_FOUND:
                this.setState({notFound: true});
                break;
              default:
                Listen.message.error('出错啦');
                break;
            }
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

  private getNumberBeforeRpx = (item) => {
    return Number(item.substring(0, item.indexOf('rpx')));
  };

  private createHotTextStyleSetting = (originSetting, word) => {
    let length = word.length;
    let width = this.getNumberBeforeRpx(originSetting.width);
    let height = this.getNumberBeforeRpx(originSetting.height);

    let large;
    let small;
    let lineCount;
    let showWord;
    if (width < height) {
      large = height;
      small = width;
      lineCount = length;
      showWord = word.split('').join('\n');
    } else {
      large = width;
      small = height;
      lineCount = 1;
      showWord = word;
    }

    return {
      style: {
        ...originSetting,
        lineHeight: `${(height / lineCount) >>> 0}rpx`,
        fontSize: `${Math.min((large / length) >>> 0, small)}rpx`
      },
      showWord
    };
  };

  render() {
    let view;

    if (this.state.notFound) {
      view = (
        <View className={'page-zero base-page'}>
          <View className={'user-info'}>
            <AppAvatar size={24} margin={10}/>
            <View className={'user-info-vertical-separator'}/>
            <OpenData className={'normal-text sm-margin user-data'} type={'userNickName'}/>
          </View>
          <View className={'title-info show-up'}>
            <Text className={'report-title-text'} decode={true}>倾&nbsp;诉&nbsp;报&nbsp;告</Text>
            <Text className={'app-name-text'} decode={true}>Mr&nbsp;Listen</Text>
            <Text className={'app-intro-text'} decode={true}>倾&nbsp;听&nbsp;你&nbsp;的&nbsp;一&nbsp;切</Text>
          </View>
          <View className={'prompt-view'}>
            <Text className={'enter-text'}>倾诉报告暂未生成</Text>
            <Text className={'enter-text'} decode={true}>每月&nbsp;1&nbsp;号生成倾诉报告</Text>
          </View>
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
                <Text className={'report-title-text'} decode={true}>倾&nbsp;诉&nbsp;报&nbsp;告</Text>
                <Text className={'app-name-text'} decode={true}>Mr&nbsp;Listen</Text>
                <Text className={'app-intro-text'} decode={true}>倾&nbsp;听&nbsp;你&nbsp;的&nbsp;一&nbsp;切</Text>
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

          let reportInfo =
            wordCount
              ? (
                <View className={'report-info show-up'}>
                  <View className={'hot-word-view'}>
                    {this.report.mostUsedWords.map((config, idx) => {
                      let word = config[0];
                      let originSetting = this.wordCloudSetting[wordCount][idx];
                      let setting = this.createHotTextStyleSetting(originSetting, word);
                      return (
                        <Text key={`hot-word-${idx}`}
                              className={`hot-word`}
                              style={setting.style}
                        >
                          {setting.showWord}
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
