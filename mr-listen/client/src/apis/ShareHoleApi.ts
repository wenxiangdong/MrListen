import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import Cache from "./Cache";
import {IHoleVO} from "./HoleApi";
import {apiHub} from "./ApiHub";
import * as Taro from "@tarojs/taro";
import Const from "./Const";
import Util from "./Util";
import IQueryResult = Taro.cloud.DB.IQueryResult;

export interface IShareHoleApi {
  createShareHole(holeId: string | number, expireIn?: number): Promise<string | number>;

  getShareHole(shareHoleId: string | number): Promise<ShareHoleVO>;

  plusOne(shareHoleId: string | number): Promise<void>;
}

export interface ShareHoleVO extends VO {
  expiryTime: number;
  // expireIn: number;
  /**
   *
   {
        detail: IHoleVO
        bubbleVOs: BubbleVO[]
    }
   */
  snapShot: string;
  plusOneCount: number;
}

export class ShareHoleApi implements IShareHoleApi {
  private base: IHttpRequest = HttpRequest.getInstance();
  private cache: Cache = Cache.getInstance();

  async createShareHole(holeId: string | number, expireIn: number = -1): Promise<string | number> {
    let snapShot = {
        detail: (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION)).doc(holeId).get(),
        bubbleVOs: await apiHub.holeApi.getBubblesFromHole(holeId)
      }
    ;

    return await this.base.add(Const.SHARE_HOLE_COLLECTION, {
      expiryTime: expireIn >= 0 ? this.base.serverDate({offset: expireIn}) : -1,
      snapShot,
      plusOneCount: 0,
    })
  }

  async getShareHole(shareHoleId: string | number): Promise<ShareHoleVO> {
    let result = await this.base.doc(Const.SHARE_HOLE_COLLECTION, shareHoleId).get() as IQueryResult;
    if (result.data) {
      return Util.copyWithTimestamp(result.data);
    }
    throw new Error("未找到该分享树洞");
  }

  async plusOne(shareHoleId: string | number): Promise<void> {
    await this.base.callFunction<void>("plus_one", {shareHoleId});
  }

}

export class MockShareHoleApi implements IShareHoleApi {
  private http = MockRequest.getInstance();

  // @ts-ignore
  createShareHole(holeId: string | number, expireIn: number): Promise<string | number> {
    return this.http.success(0);
  }

  // @ts-ignore
  getShareHole(shareHoleId: string | number): Promise<ShareHoleVO> {
    return this.http.success("cloud://first-57afbf.6669-first-57afbf/qr_code/1556513004844");
  }

  // @ts-ignore
  plusOne(shareHoleId: string | number): Promise<void> {
    return this.http.success();
  }

}
