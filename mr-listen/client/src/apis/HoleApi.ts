import {Bubble, Reply} from "./BubbleApi";
import {IHttpRequest, MockRequest} from "./HttpRequest";
import "@tarojs/async-await";

export interface IHoleApi {
  // post
  createHole(): Promise<number>;
// get
  getHoles(index: number, offset: number): Promise<IHole[]>;

// post
  deleteHole(holeId: number): Promise<void>;

// post
  updateHole(hole: IHole): Promise<void>;

// get
  getBubblesFromHole(index: number, offset: number): Promise<BubbleVO[]>;
}

export interface BubbleVO extends Bubble {
  replyList: Reply[];
}

export interface IHole {
  id: number;
  userId: number;
  createTime: number;
  updateTime: number;
  title: string;
  avatarUrl: string;
}

/**
 * 真正的api
 */
export class HoleApi implements IHoleApi {

  constructor(private base: IHttpRequest){}

  async createHole(): Promise<number> {
    return this.base.request("createHole");
  }

  async deleteHole(holeId: number): Promise<void> {
    return this.base.request("deleteHole", {holeId});
  }

  async getBubblesFromHole(index: number, offset: number): Promise<BubbleVO[]> {
    return this.base.request("getBubblesFromHole", {index, offset});
  }

  async getHoles(index: number, offset: number): Promise<IHole[]> {
    return this.base.request("getHoles", {index, offset});
  }

  async updateHole(hole: IHole): Promise<void> {
    return this.base.request("updateHole", {hole});
  }

}

/**
 * 假的测试api
 */
export class MockHoleApi implements IHoleApi{

  private http = new MockRequest();

  createHole(): Promise<number> {
    return this.http.success();
  }

  // @ts-ignore
  deleteHole(holeId: number): Promise<void> {
    return this.http.success();
  }

  // @ts-ignore
  getBubblesFromHole(index: number, offset: number): Promise<BubbleVO[]> {
    return this.http.success();
  }

  // @ts-ignore
  getHoles(index: number, offset: number): Promise<IHole[]> {
    return this.http.success();
  }

  // @ts-ignore
  updateHole(hole: IHole): Promise<void> {
    return this.http.success();
  }

}
