// 一定要import这句才能开启async await语法
import "@tarojs/async-await";

import {IUserApi, MockUserApi, UserApi} from "./UserApi";
import {BubbleApi, IBubbleApi, MockBubbleApi} from "./BubbleApi";
import {HoleApi, IHoleApi, MockHoleApi} from "./HoleApi";
import {FileApi, IFileApi, MockFileApi} from "./FileApi";
import {IShareHoleApi, MockShareHoleApi, ShareHoleApi} from "./ShareHoleApi";
import {IReportApi, MockReportApi, ReportApi} from "./ReportApi";

export interface IApiHub {
  userApi: IUserApi;
  bubbleApi: IBubbleApi;
  holeApi: IHoleApi;
  fileApi: IFileApi;
  shareHoleApi: IShareHoleApi;
  reportApi: IReportApi;
}

class ApiHub implements IApiHub {
  constructor() {
    this.bubbleApi = new BubbleApi();
    this.holeApi = new HoleApi();
    this.userApi = new UserApi();
    this.fileApi = new FileApi();
    this.shareHoleApi = new ShareHoleApi();
    this.reportApi = new ReportApi();
  }

  bubbleApi: IBubbleApi;
  holeApi: IHoleApi;
  userApi: IUserApi;
  fileApi: IFileApi;
  shareHoleApi: IShareHoleApi;
  reportApi: IReportApi;
}


class MockApiHub implements IApiHub {
  constructor() {
    this.bubbleApi = new MockBubbleApi();
    this.holeApi = new MockHoleApi();
    this.userApi = new MockUserApi();
    this.fileApi = new MockFileApi();
    this.shareHoleApi = new MockShareHoleApi();
    this.reportApi = new MockReportApi();
  }

  bubbleApi: IBubbleApi;
  holeApi: IHoleApi;
  userApi: IUserApi;
  fileApi: IFileApi;
  shareHoleApi: IShareHoleApi;
  reportApi: IReportApi;
}

const useMock = false;
const apiHub: IApiHub = useMock ? new MockApiHub() : new ApiHub();

export {apiHub};
