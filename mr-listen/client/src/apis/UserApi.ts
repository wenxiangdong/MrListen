import {HttpRequest, IHttpRequest, MockRequest} from "./HttpRequest";
import "@tarojs/async-await";

export interface IUserApi {
  login(): Promise<void>;
}


/**
 * 真正的api
 */
export class UserApi implements IUserApi {
  private base: IHttpRequest = new HttpRequest();
  constructor() {
  }

  public async login() {
    return this.base.request<void>("login");
  }
}


/**
 * 假的测试api
 */
export class MockUserApi implements IUserApi {
  private http = new MockRequest();

  login(): Promise<void> {
    return this.http.success();
  }

}


