import { HttpRequest, IHttpRequest, MockRequest, VO } from "./HttpRequest";
import Cache from "./Cache";
import { IHoleVO } from "./HoleApi";
import { apiHub } from "./ApiHub";
import Const from "./Const";
import { BubbleStyle, BubbleType, BubbleVO } from "./BubbleApi";

export interface IShareHoleApi {
  createShareHole(holeId: string | number, expireIn?: number): Promise<string | number>;

  getShareHole(key: string | number): Promise<ShareHoleVO>;

  plusOne(shareHoleId: string | number): Promise<void>;

  getQrCode(params: any): Promise<string>;
}

export interface ShareHoleVO extends VO {
  expiryTime: number;
  key: string;
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
    };

    // @ts-ignore
    let key = new Date().getTime() + '' + Math.floor(Math.random() * 1000);

    await this.base.add(Const.SHARE_HOLE_COLLECTION, {
      key,
      expiryTime: expireIn >= 0 ? new Date().getTime() + expireIn : expireIn,
      snapShot,
      plusOneCount: 0,
    });
    return key;
  }

  async getShareHole(key: string | number): Promise<ShareHoleVO> {
    return await this.base.callFunction<ShareHoleVO>("get_share_hole", { key });
  }

  async plusOne(shareHoleId: string | number): Promise<void> {
    await this.base.callFunction<void>("plus_one", { shareHoleId });
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
  getShareHole(key: string | number): Promise<ShareHoleVO> {
    return this.http.success({
      snapShot: JSON.stringify({
        plusOneCount: 0,
        bubbleVOs: new Array(10)
          .fill(
            {
              holeId: "holeId",
              _id: -1,
              style: BubbleStyle.NORMAL,
              type: BubbleType.TEXT,
              replyList: [],
              content: "",
              createTime: new Date().getTime(),
              _openid: ""
            } as BubbleVO
          ).map((item, index) =>
            ({
              ...item,
              _id: index,
              content: Math.random().toString(),
              style: index % 3
            })
          )
      })
    });
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
