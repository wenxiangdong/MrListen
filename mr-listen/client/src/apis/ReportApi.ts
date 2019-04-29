import {IHttpRequest, MockRequest, VO} from "./HttpRequest";
import Cache from "./Cache";

export interface IReportApi {
  getReport(): Promise<ReportVO>;
}

export interface ReportVO extends VO {
  meetTime: number;
  holeCount: number;
  longestDuration: number;
  mostUsedWords: { [key: string]: number };
  latestTime: number;
  plusOneCount: number;
}

export class ReportApi implements IReportApi {
  private cache: Cache = Cache.getInstance();

  async getReport(): Promise<ReportVO> {
    let reportVOs = (await this.cache.collection<ReportVO>(Const.REPORT_COLLECTION)).get();
    if (reportVOs && reportVOs.length) {
      return reportVOs[0];
    } else {
      throw new Error("未找到您的报告");
    }
  }
}

export class MockReportApi implements IReportApi {
  // @ts-ignore
  private http: IHttpRequest = MockRequest.getInstance();

  getReport(): Promise<ReportVO> {
    throw new Error("未找到您的报告");
  }
}
