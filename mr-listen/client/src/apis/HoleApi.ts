import "@tarojs/async-await";
import {BubbleStyle, BubbleType, BubbleVO, ReplyVO} from "./BubbleApi";
import {MockRequest, VO} from "./HttpRequest";
import Cache from "./Cache";
import Const from "./Const";

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
  private cache: Cache = Cache.getInstance();

  async createHole(): Promise<string | number> {
    let count = (await this.cache
      .collection<IHoleVO>(Const.HOLE_COLLECTION))
      .count();

    let index: number = count + 1;
    let avatarUrl = this.getDefaultAvatarUrl();

    return await (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION))
      .add({
        title: `树洞${index}号`,
        avatarUrl
      });

    // return await (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION))
    //   .add({
    //     title: `树洞${index}号`,
    //     avatarUrl: Const.HOLE_DEFAULT_AVATAR_URL
    //   })
  }

  private getDefaultAvatarUrl(): String {
    // return Const.HOLE_DEFAULT_AVATAR_URLS[(Math.random() * Const.HOLE_DEFAULT_AVATAR_URLS.length) >>> 0];
    let index = Math.round(Math.random() * Const.HOLE_DEFAULT_AVATAR_URLS.length);
    console.log("======================================", index);
    return Const.HOLE_DEFAULT_AVATAR_URLS[index];
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
    let bubbleVOs: BubbleVO[] = await (await this.cache.collection<BubbleVO>(Const.BUBBLE_COLLECTION))
      .where({holeId})
      .orderBy('createTime', 'asc')
      .get();

    for (let bubbleVO of bubbleVOs) {
      bubbleVO.replyList = await this.getReplyVOs(bubbleVO._id);
    }
    return bubbleVOs;
  }

  private async getReplyVOs(bubbleId: string | number): Promise<ReplyVO[]> {
    return await (await this.cache.collection<ReplyVO>(Const.REPLY_COLLECTION))
      .where({bubbleId})
      .orderBy('createTime', 'asc')
      .get();
  }

  async updateHole(holeId: string | number, hole: IHole): Promise<void> {
    await (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION)).doc(holeId).update(hole);
  }

  async getHoles(lastHoleId: string | number, offset: number = 20): Promise<IHoleVO[]> {
    let iHoleVOs: IHoleVO[] = await (await this.cache.collection<IHoleVO>(Const.HOLE_COLLECTION))
      .orderBy('createTime', 'desc')
      .get();

    let start = 0;
    if (lastHoleId) {
      for (let i = 0, length = iHoleVOs.length; i < length; i++) {
        let value = iHoleVOs[i];
        if (value._id === lastHoleId) {
          start = i + 1;
          break;
        }
      }
    }
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
    let bubbleVOList: BubbleVO[] =
      new Array(10)
        .fill(
          {
            holeId,
            _id: -1,
            style: BubbleStyle.NORMAL,
            type: BubbleType.TEXT,
            replyList: [],
            content: "",
            createTime: Date.now(),
            _openid: ""
          } as BubbleVO
        ).map((item, index) =>
        ({
          ...item,
          _id: index,
          content: Math.random().toString(),
          style: index % 3
        })
      );

    return this.http.success(bubbleVOList);
  }

  // @ts-ignore
  getHoles(lastHoleId: string | number, offset: number): Promise<IHoleVO[]> {
    let holeVOList: IHoleVO[] = [];
    for (let i = 1; i <= offset; i++) {
      let id:string = (Number(lastHoleId) + i) + '';
      holeVOList.push({
        _id: id,
        _openid: id,
        createTime: Date.now(),
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
