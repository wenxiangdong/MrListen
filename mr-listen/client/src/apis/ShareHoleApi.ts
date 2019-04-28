import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import Cache from "./Cache";
import {IHoleVO} from "./HoleApi";
import {apiHub} from "./ApiHub";
import IQueryResult = Taro.cloud.DB.IQueryResult;

export interface IShareHoleApi {
  createShareHole(holeId: string | number, expireIn?: number): Promise<string | number>;

  getShareHole(shareHoleId: string | number): Promise<ShareHoleVO>;

  plusOneCount(shareHoleId: string | number): Promise<void>;
}

export interface ShareHoleVO extends VO {
  expireIn: number;
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

  async createShareHole(holeId: string | number, expireIn: number): Promise<string | number> {
    let snapShot = {
        detail: (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION)).doc(holeId).get(),
        bubbleVOs: await apiHub.holeApi.getBubblesFromHole(holeId)
      }
    ;

    return await this.base.add(Const.SHARE_HOLE_COLLECTION, {
      holeId,
      expireIn,
      snapShot,
      plusOneCount: 0,
    })
  }

  async getShareHole(shareHoleId: string | number): Promise<ShareHoleVO> {
    let result = await this.base.doc(Const.SHARE_HOLE_COLLECTION, shareHoleId).get() as IQueryResult;
    if (result.data) {
      return Util.copyWithTimestamp(result.data);
    }
    throw new Error("未找到分享树洞")
  }

  async plusOneCount(shareHoleId: string | number): Promise<void> {
    await this.base.callFunction<void>("plusOneCount", {shareHoleId});
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
    return this.http.success(null);
  }

  // @ts-ignore
  plusOneCount(shareHoleId: string | number): Promise<void> {
    return this.http.success();
  }

}
