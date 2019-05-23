import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import "@tarojs/async-await";
import Cache from "./Cache";
import Const from "./Const";

export interface IUserApi {
  login(): Promise<string | number>;

  canIUse(key: string): Promise<boolean>;

  getEmoji(): Promise<object>;
}

export interface UserVO extends VO {
  openid: string | number,
  createTime: number,
}

export interface EmojiVO extends VO {
  value: object
}


/**
 * 真正的api
 */
export class UserApi implements IUserApi {
  private base: IHttpRequest = HttpRequest.getInstance();
  private cache: Cache = Cache.getInstance();

  async login(): Promise<string | number> {
    return await this.base.callFunction<string | number>('login');
  }

  async canIUse(key: string): Promise<boolean> {
    return await this.base.callFunction<boolean>('can_i_use', {key});
  }

  async getEmoji(): Promise<object> {
    return (await this.cache.collection<EmojiVO>(Const.EMOJI_COLLECTION)).get()[0].value;
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

  // @ts-ignore
  async canIUse(key: string): Promise<boolean> {
    return this.http.success(true);
  }

  async getEmoji(): Promise<object> {
    return this.http.success({});
  }
}


