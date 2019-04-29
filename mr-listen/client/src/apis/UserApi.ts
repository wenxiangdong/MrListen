import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import "@tarojs/async-await";
import Cache from "./Cache";

export interface IUserApi {
  login(): Promise<string | number>;
}

export interface UserVO extends VO {

}


/**
 * 真正的api
 */
export class UserApi implements IUserApi {
  private base: IHttpRequest = HttpRequest.getInstance();
  private cache: Cache = Cache.getInstance();

  constructor() {
  }

  async login(): Promise<string | number> {
    let exist = await this.base
      .collection(Const.USER_COLLECTION)
      .get();

    let id: string | number;
    if (!exist) {
      id = await this.base.add(Const.USER_COLLECTION);
      await this.base.add(Const.REPORT_COLLECTION, {
        meetTime: this.base.serverDate(),
        holeCount: 0,
        longestDuration: 0,
        mostUsedWords: {},
        latestTime: 0,
        plusOneCount: 0,
      });
    } else {
      let data = exist.data;
      if (!data.length)
        id = await this.base.add(Const.USER_COLLECTION);
      else
        id = data[0]._id ? data[0]._id : '';
    }

    this.cache.init();
    return id;
  }
}

/**
 * 假的测试api
 */
export class MockUserApi implements IUserApi {
  private http = MockRequest.getInstance();

  public async login(): Promise<string | number> {
    return this.http.success(0);
  }
}


