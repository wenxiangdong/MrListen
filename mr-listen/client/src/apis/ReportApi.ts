import "@tarojs/async-await";
import * as Taro from "@tarojs/taro";
import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";

export interface IReportApi {
  getReport(): Promise<ReportVO>;
  isLocalReportAvailable(): boolean;
  getLocalReportSync(): ReportVO;
  setLocalReportSync(report: ReportVO): void;
}

export interface ReportVO extends VO {
  userId: string;
  meetTime: number;
  holeCount: number;
  longestDuration: number;
  // 数组，每个元素也为数组，元素数组第一项为词语，第二项为出现次数
  mostUsedWords: Array<Array<string | number>>;
  // 如果未曾倾诉，结果为0
  latestTime: number;
  shareHoleCount: number;
  plusOneCount: number;
}

export class ReportApi implements IReportApi {
  private readonly KEY = 'mr.listen.report_config';
  private base: IHttpRequest = HttpRequest.getInstance();

  async getReport(): Promise<ReportVO> {
    return await this.base.callFunction<ReportVO>('get_report');
  }

  getLocalReportSync(): ReportVO {
    return Taro.getStorageSync(this.KEY).report;
  }

  isLocalReportAvailable(): boolean {
    let now = new Date(Date.now());
    let reportConfig = Taro.getStorageSync(this.KEY);
    return reportConfig && reportConfig.date && reportConfig.date.year == now.getFullYear() && reportConfig.date.month == now.getMonth() && reportConfig.report;
  }

  setLocalReportSync(report: ReportVO): void {
    let now = new Date(Date.now());
    Taro.setStorageSync(this.KEY, {
      report,
        date: {
          year: now.getFullYear(),
          month: now.getMonth()
        }
      }
    );
  }
}

export class MockReportApi implements IReportApi {
  // @ts-ignore
  private http = MockRequest.getInstance();

  private static createMockReport(): ReportVO {
    return {
      _id: '',
      userId: 'userId',
      meetTime: new Date().getTime(),
      holeCount: (Math.random() * 10) >>> 0,
      longestDuration: ((Math.random() * 10 * 1000) >>> 0),
      mostUsedWords: [['测试1',20],['测试2',10],['测试3',5],['测试4',2],['测试5',1],],
      latestTime: new Date().getTime(),
      plusOneCount: (Math.random() * 10) >>> 0,
      shareHoleCount: (Math.random() * 10) >>> 0
    };
  }

  getReport(): Promise<ReportVO> {
    return this.http.success(MockReportApi.createMockReport());
  }

  isLocalReportAvailable(): boolean {
    return false;
  }

  getLocalReportSync(): ReportVO {
    return MockReportApi.createMockReport();
  }

  setLocalReportSync(report: any): void {
    console.log('set local report', report);
  }
}
