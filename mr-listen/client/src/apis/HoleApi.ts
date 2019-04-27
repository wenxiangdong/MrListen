import "@tarojs/async-await";
import {BubbleVO, ReplyVO} from "./BubbleApi";
import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import Cache from "./Cache";
import ICountResult = Taro.cloud.DB.ICountResult;
import IQueryResult = Taro.cloud.DB.IQueryResult;
import IQuerySingleResult = Taro.cloud.DB.IQuerySingleResult;

export interface IHoleApi {
  createHole(): Promise<string | number>;

  // 先去缓存中找，没找到再去数据库中查找，其余 get 方法同理
  getHoles(index: number, offset?: number): Promise<IHoleVO[]>;

  deleteHole(holeId: string | number): Promise<void>;

  updateHole(holeId: string | number, hole: IHole): Promise<void>;

  getBubblesFromHole(holeId: string | number, index: number, offset?: number): Promise<BubbleVO[]>;
}

export interface IHole {
  title: string;
  avatarUrl: string;
}

export interface IHoleVO extends VO {
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
    let count = await this.base
      .collection(Const.HOLE_COLLECTION)
      .count() as ICountResult;
    let index: number = count ? count.total + 1 : 1;

    let id = await this.base.add(Const.HOLE_COLLECTION, {
      title: `树洞 ${index} 号`,
      avatarUrl: Const.HOLE_DEFAULT_AVATAR_URL
    });

    let holeVOResult = await this.base
      .doc(Const.HOLE_COLLECTION, id)
      .get() as IQuerySingleResult;

    if (holeVOResult.data) {
      this.cache.add(Const.HOLE_COLLECTION, Util.copyWithTimestamp<IHoleVO>(holeVOResult.data));
    }

    return id;
  }

  async deleteHole(holeId: string | number): Promise<void> {
    await this.base.remove(Const.HOLE_COLLECTION, holeId);

    this.cache.remove(Const.HOLE_COLLECTION, holeId);
  }

  async getBubblesFromHole(holeId: string | number, index: number, offset: number = 20): Promise<BubbleVO[]> {
    return this.getBubbleVOs(holeId, index, offset);
  }

  private async getBubbleVOs(holeId: string | number, index: number, offset: number): Promise<BubbleVO[]> {
    let bubbleCollection = this.cache.collection<BubbleVO>(Const.BUBBLE_COLLECTION);

    if (bubbleCollection) {
      let bubbleVOs: BubbleVO[] = bubbleCollection
        .where({holeId})
        .orderBy('createTime', false)
        .skip_limit(index * offset, offset)
        .get();

      // 成功命中缓存
      if (bubbleVOs.length >= offset)
        return bubbleVOs;
    }

    const bubbleResult = await this.base
      .collection(Const.BUBBLE_COLLECTION)
      .where({holeId})
      .orderBy('createTime', 'desc')
      .skip(index * offset)
      .limit(offset)
      .get() as IQueryResult;

    if (!bubbleResult.data)
      return [];

    let bubbleVOs: BubbleVO[] = [];
    for (let data of bubbleResult.data) {
      if (data) {
        let bubbleVO: BubbleVO = Util.copyWithTimestamp(data);
        this.cache.add(Const.BUBBLE_COLLECTION, Util.copy(bubbleVO));
        bubbleVO.replyList = await this.getReplyVOs(bubbleVO._id);
        bubbleVOs.push(bubbleVO);
      }
    }
    return bubbleVOs;
  }

  private async getReplyVOs(bubbleId: string | number): Promise<ReplyVO[]> {
    let replyCollection = this.cache.collection<ReplyVO>(Const.REPLY_COLLECTION);
    if (replyCollection) {
      return replyCollection
        .where({bubbleId})
        .get();
    }

    let replyResult = await this.base
      .collection(Const.REPLY_COLLECTION)
      .where({bubbleId})
      .orderBy('createTime', 'asc')
      .get() as IQueryResult;

    if (!replyResult.data)
      return [];

    let replyVOs: ReplyVO[] = [];
    for (let data of replyResult.data) {
      if (data) {
        let replyVO: ReplyVO = Util.copyWithTimestamp<ReplyVO>(data);
        this.cache.add(Const.REPLY_COLLECTION, Util.copy(replyVO));
        replyVOs.push(replyVO);
      }
    }
    return replyVOs;
  }


  async updateHole(holeId: string | number, hole: IHole): Promise<void> {
    await this.base.update(Const.HOLE_COLLECTION, holeId, hole);

    let holeVOResult = await this.base
      .doc(Const.HOLE_COLLECTION, holeId)
      .get() as IQuerySingleResult;

    if (holeVOResult.data) {
      this.cache.update(Const.HOLE_COLLECTION, Util.copyWithTimestamp<IHoleVO>(holeVOResult.data));
    }
  }

  async getHoles(index: number, offset: number = 20): Promise<IHoleVO[]> {
    let holeCollection = this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION);
    if (holeCollection) {
      let iHoleVOs: IHoleVO[] = holeCollection
        .orderBy('updateTime', false)
        .skip_limit(index * offset, offset)
        .get();

      //成功命中缓存
      if (iHoleVOs.length >= offset) {
        return iHoleVOs;
      }
    }

    //hole
    let holeResult = await this.base
      .collection(Const.HOLE_COLLECTION)
      .orderBy('updateTime', 'desc')
      .skip(index * offset)
      .limit(offset)
      .get() as IQueryResult;

    if (!holeResult.data)
      return [];

    let iHoleVOs: IHoleVO[] = [];
    for (let data of holeResult.data) {
      if (data) {
        let iHoleVO: IHoleVO = Util.copyWithTimestamp<IHoleVO>(data);
        this.cache.add(Const.REPLY_COLLECTION, Util.copy(iHoleVO));
        iHoleVOs.push(iHoleVO);
      }
    }

    return iHoleVOs;
  }
}

/**
 * 假的测试api
 */
export class MockHoleApi implements IHoleApi {

  private http = MockRequest.getInstance();

  createHole(): Promise<string | number> {
    return this.http.success(0);
  }

  // @ts-ignore
  deleteHole(holeId: number): Promise<void> {
    return this.http.success();
  }

  // @ts-ignore
  getBubblesFromHole(holeId: number, index: number, offset: number): Promise<BubbleVO[]> {
    return this.http.success([]);
  }

  // @ts-ignore
  getHoles(index: number, offset: number): Promise<IHoleVO[]> {
    return this.http.success([]);
  }

  // @ts-ignore
  updateHole(holeId: string | number, hole: IHole): Promise<void> {
    return this.http.success();
  }

}
