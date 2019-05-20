import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import Cache from "./Cache";
import {IHoleVO} from "./HoleApi";
import {apiHub} from "./ApiHub";
import Const from "./Const";
import Util from "./Util";

export interface IShareHoleApi {
  createShareHole(holeId: string | number, expireIn?: number): Promise<string | number>;

  getShareHole(shareHoleId: string | number): Promise<ShareHoleVO>;

  plusOne(shareHoleId: string | number): Promise<void>;

  getQrCode(params: any): Promise<string>;
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

    let _id = Util.uuid(16);

    return await this.base.add(Const.SHARE_HOLE_COLLECTION, {
      _id,
      expiryTime: expireIn >= 0 ? this.base.serverDate({offset: expireIn}) : -1,
      snapShot,
      plusOneCount: 0,
    })
  }

  async getShareHole(shareHoleId: string | number): Promise<ShareHoleVO> {
    return await this.base.callFunction<ShareHoleVO>("get_share_hole", {shareHoleId});
  }

  async plusOne(shareHoleId: string | number): Promise<void> {
    await this.base.callFunction<void>("plus_one", {shareHoleId});
  }

  getQrCode(params: any): Promise<string> {
    return this.base.callFunction<string>("create_qr_code", params);
  }

}

export class MockShareHoleApi implements IShareHoleApi {
  private http = MockRequest.getInstance();

  // @ts-ignore
  createShareHole(holeId: string | number, expireIn: number): Promise<string | number> {
    return this.http.success("shareHoleId");
  }

  // @ts-ignore
  getShareHole(shareHoleId: string | number): Promise<ShareHoleVO> {
    return this.http.success(0);
  }

  // @ts-ignore
  plusOne(shareHoleId: string | number): Promise<void> {
    return this.http.success();
  }

  // @ts-ignore
  async getQrCode(params: any): Promise<string> {
    return this.http.success("cloud://first-57afbf.6669-first-57afbf/qr_code/1556513004844");
  }

}
