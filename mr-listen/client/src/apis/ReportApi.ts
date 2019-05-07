import "@tarojs/async-await";
import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";

export interface IReportApi {
  getReport(): Promise<ReportVO>;
}

export interface ReportVO extends VO {
  userId: string;
  meetTime: number;
  holeCount: number;
  longestDuration: number;
  // 数组，每个元素也为数组，元素数组第一项为词语，第二项为出现次数
  mostUsedWords: Array<Array<string | number>>;
  latestTime: number;
  plusOneCount: number;
}

export class ReportApi implements IReportApi {
  private base: IHttpRequest = HttpRequest.getInstance();

  async getReport(): Promise<ReportVO> {
    return await this.base.callFunction<ReportVO>('get_report');
  }
}

export class MockReportApi implements IReportApi {
  // @ts-ignore
  private http = MockRequest.getInstance();

  getReport(): Promise<ReportVO> {
    let report:ReportVO = {
      _id: '',
      userId: 'userId',
      meetTime: new Date().getTime(),
      holeCount: (Math.random() * 10) >>> 0,
      longestDuration: ((Math.random() * 10) >>> 0),
      mostUsedWords: [['测试',10]],
      latestTime: new Date().getTime(),
      plusOneCount: (Math.random() * 10) >>> 0
    };
    return this.http.success(report);
  }
}
