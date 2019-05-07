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

  async login(): Promise<string | number> {
    return await this.base.callFunction<string | number>('login');
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


