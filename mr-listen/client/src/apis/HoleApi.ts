import "@tarojs/async-await";
import {BubbleVO, ReplyVO} from "./BubbleApi";
import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import Cache, {Collection} from "./Cache";

export interface IHoleApi {
  createHole(): Promise<string | number>;

  // getHoles(index: number, offset?: number): Promise<IHoleVO[]>;
  getHoles(lastHoleId: string | number, offset?: number): Promise<IHoleVO[]>;

  deleteHole(holeId: string | number): Promise<void>;

  updateHole(holeId: string | number, hole: IHole): Promise<void>;

  // getBubblesFromHole(holeId: string | number, index: number, offset?: number): Promise<BubbleVO[]>;

  getBubblesFromHole(holeId: string | number): Promise<BubbleVO[]>;
}

export interface IHole {
  title: string;
  avatarUrl: string;
}

export interface IHoleVO extends VO {
  _openid: string;
  createTime: number;
  title: string;
  avatarUrl: string;
}

// @ts-ignore
class Hole implements IHole {
}

// @ts-ignore
class HoleVO implements IHoleVO {
}

// @ts-ignore
class HistoryHole implements IHole {
}

// @ts-ignore
class HistoryHoleVO implements IHoleVO {
}

/**
 * 真正的api
 */
export class HoleApi implements IHoleApi {
  private base: IHttpRequest = HttpRequest.getInstance();
  private cache: Cache = Cache.getInstance();

  async createHole(): Promise<string | number> {
    let count = (await this.cache
      .collection<IHoleVO>(Const.HOLE_COLLECTION))
      .count();

    let index: number = count + 1;

    return await (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION))
      .add({
        createTime: this.base.serverDate(),
        title: `树洞 ${index} 号`,
        avatarUrl: Const.HOLE_DEFAULT_AVATAR_URL
      })
  }

  async deleteHole(holeId: string | number): Promise<void> {
    await (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION))
      .doc(holeId)
      .remove();
  }

  async getBubblesFromHole(holeId: string | number): Promise<BubbleVO[]> {
    return this.getBubbleVOs(holeId);
  }

  private async getBubbleVOs(holeId: string | number): Promise<BubbleVO[]> {
    let bubbleVOs: BubbleVO[] = await (await this.cache.collection<BubbleVO>(Const.BUBBLE_COLLECTION, holeId, {holeId}))
      .where({holeId})
      .get()
      .sort((a, b) => {
        let field = "createTime";
        return a[field] - b[field];
      });

    for (let bubbleVO of bubbleVOs) {
      bubbleVO.replyList = await this.getReplyVOs(bubbleVO._id);
    }
    return bubbleVOs;
  }

  private async getReplyVOs(bubbleId: string | number): Promise<ReplyVO[]> {
    return await (await this.cache.collection<ReplyVO>(Const.REPLY_COLLECTION, bubbleId, {bubbleId}))
      .where({bubbleId})
      .get();
  }

  async updateHole(holeId: string | number, hole: IHole): Promise<void> {
    await (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION)).doc(holeId).update(hole);
  }

  async getHoles(lastHoleId: string | number, offset: number = 20): Promise<IHoleVO[]> {
    let iHoleCollection: Collection<IHoleVO> = await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION);

    let iHoleVOs: IHoleVO[] = (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION))
      .get();

    iHoleVOs.sort((a, b) => {
      let field = "createTime";
      return b[field] - a[field];
    });

    let start: number = lastHoleId ? iHoleVOs.indexOf(iHoleCollection.doc(lastHoleId).get()) : 0;
    return iHoleVOs.slice(start, start + offset);
  }
}

/**
 * 假的测试api
 */
export class MockHoleApi implements IHoleApi {

  private http = MockRequest.getInstance();

  createHole(): Promise<string | number> {
    return this.http.success(Math.random());
  }

  // @ts-ignore
  deleteHole(holeId: number): Promise<void> {
    return this.http.success();
  }

  // @ts-ignore
  getBubblesFromHole(holeId: number): Promise<BubbleVO[]> {
    return this.http.success([]);
  }

  // @ts-ignore
  getHoles(lastHoleId: string | number, offset: number): Promise<IHoleVO[]> {
    let holeVOList: IHoleVO[] = [];
    for (let i = 1; i <= offset; i++) {
      let id = (typeof lastHoleId == 'number')? i + Number(lastHoleId): `${i}${lastHoleId}`;
      holeVOList.push({
        _id: id,
        _openid: '' + id,
        createTime: new Date().getTime(),
        title: `树洞 ${id} 号`,
        avatarUrl: ''
      })
    }
    return this.http.success(holeVOList);
  }

  // @ts-ignore
  updateHole(holeId: string | number, hole: IHole): Promise<void> {
    return this.http.success();
  }

}
