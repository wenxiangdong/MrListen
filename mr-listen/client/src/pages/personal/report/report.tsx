import Taro, {Component, Config} from '@tarojs/taro'
import {View} from '@tarojs/components'

import {
  PageOne,
  PageTwo,
  PageThree,
  PageFour,
  PageFive,
  PageSix,
  // PageSeven,
  PageEight
} from './../../../components/personal/report/ReportPages'

import Logger from './../../../utils/logger'
import Listen from '../../../utils/listen'
import {apiHub} from '../../../apis/ApiHub'
import {ReportVO} from '../../../apis/ReportApi'
import {HttpCode, HttpResponse} from "../../../apis/HttpRequest";
import reportHelper from "../../../utils/report-helper";

interface IState {
  pageIndex: number
}

/**
 * 报告页面
 * @author 张李承
 * @create 2019/4/22 23:26
 */
export class Report extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '倾诉报告',
    disableScroll: true
    // navigationBarBackgroundColor: '#1A237E',
    // navigationBarTextStyle: 'white',
  };

  private logger = Logger.getLogger(Report.name);
  private report:ReportVO;

  componentWillMount() {
    Listen.showLoading('生成报告中')
      .then(() => {
        let api = apiHub.reportApi;

        if (api.isLocalReportAvailable()) {
          this.setReport(api.getLocalReportSync());
        } else {
          api.getReport()
            .then((report) => {
              this.setReport(report);

              api.setLocalReportSync(report);
            })
            .catch((e:HttpResponse<ReportVO>) => this.handleReportErrCode(e));
        }
      });
  }

  private setReport(report: ReportVO) {
    this.report = report;
    this.setState({pageIndex: 1});
    Listen.hideLoading();
  }

  private handleReportErrCode(e:HttpResponse<ReportVO>) {
    let code: HttpCode = e.code;
    switch (code) {
      case HttpCode.NOT_FOUND:
        this.logger.info('not found report');
        this.setReport(reportHelper.getEmptyReport());
        break;
      default:
        this.logger.error(e);
        Listen.message.error('出错啦');
        break;
    }
    Listen.hideLoading();
  }

  private jumpToNextPage = () => {
    this.setState({pageIndex: this.state.pageIndex + 1});
  };

  private returnTop = () => {
    this.setState({pageIndex: 1});
  };

  render() {
    let view;

    switch (this.state.pageIndex) {
      case 1: {
        view = (
          <View onClick={this.jumpToNextPage}>
            <PageOne/>
          </View>
        );
        break;
      }
      case 2: {
        view = (
          <View onClick={this.jumpToNextPage}>
            <PageTwo meetTime={this.report.meetTime}/>
          </View>
        );
        break;
      }
      case 3: {
        view = (
          <View onClick={this.jumpToNextPage}>
            <PageThree holeCount={this.report.holeCount}/>
          </View>
        );
        break;
      }
      case 4: {
        view = (
          <View onClick={this.jumpToNextPage}>
            <PageFour longestDuration={this.report.longestDuration}/>
          </View>
        );
        break;
      }
      case 5: {
        view = (
          <View onClick={this.jumpToNextPage}>
            <PageFive latestTime={this.report.latestTime}/>
          </View>
        );
        break;
      }
      case 6: {
        view = (
          <View onClick={this.jumpToNextPage}>
            <PageSix shareHoleCount={this.report.shareHoleCount} plusOneCount={this.report.plusOneCount}/>
          </View>
        );
        break;
      }
      // case 7: {
      //   view = (
      //     <View onClick={this.jumpToNextPage}>
      //       <PageSeven mostUsedWords={this.report.mostUsedWords}/>
      //     </View>
      //   );
      //   break;
      // }
      // case 8: {
      case 7: {
        view = (<PageEight onReturnTopClick={this.returnTop}/>);
        break;
      }
    }

    return (view);
  }
}
