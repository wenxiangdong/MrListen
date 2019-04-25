import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import "@tarojs/async-await";

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
  private static USER_COLLECTION: string = "user";

  constructor() {
  }

  async login(): Promise<string | number> {
    let exist = await this.base.collection(UserApi.USER_COLLECTION).get();
    if (!exist) {
      return await this.base.add(UserApi.USER_COLLECTION);
    } else {
      let data = exist.data;
      if (!data.length)
        return await this.base.add(UserApi.USER_COLLECTION);
      else
        return data[0]._id ? data[0]._id : '';
    }
  }
}

/**
 * 假的测试api
 */
export class MockUserApi implements IUserApi {
  private http = MockRequest.getInstance();

  public async login(): Promise<string | number> {
    return this.http.success();
  }
}


