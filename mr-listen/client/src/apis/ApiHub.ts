import {IUserApi, MockUserApi, UserApi} from "./UserApi";
import {BubbleApi, IBubbleApi, MockBubbleApi} from "./BubbleApi";
import {HoleApi, IHoleApi, MockHoleApi} from "./HoleApi";
// 一定要import这句才能开启async await语法
import "@tarojs/async-await";

export interface IApiHub {
  userApi: IUserApi;
  bubbleApi: IBubbleApi;
  holeApi: IHoleApi;
}

class ApiHub implements IApiHub {
  constructor() {
    this.bubbleApi = new BubbleApi();
    this.holeApi = new HoleApi();
    this.userApi = new UserApi();
  }
  bubbleApi: IBubbleApi;
  holeApi: IHoleApi;
  userApi: IUserApi;
}


class MockApiHub implements IApiHub {
  bubbleApi: IBubbleApi;
  holeApi: IHoleApi;
  userApi: IUserApi;
  constructor() {
    this.bubbleApi = new MockBubbleApi();
    this.holeApi = new MockHoleApi();
    this.userApi = new MockUserApi();
  }
}



const useMock = false;
let apiHub: IApiHub;

if (useMock) {
  apiHub = new MockApiHub();
} else {
  apiHub = new ApiHub();
}

export {apiHub};
