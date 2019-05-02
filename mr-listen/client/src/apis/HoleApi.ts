import "@tarojs/async-await";
import {BubbleVO, ReplyVO} from "./BubbleApi";
import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import ICountResult = Taro.cloud.DB.ICountResult;
import IQueryResult = Taro.cloud.DB.IQueryResult;

export interface IHoleApi {
  createHole(): Promise<string | number>;

  getHoles(index: number, offset: number): Promise<IHoleVO[]>;

  deleteHole(holeId: string | number): Promise<void>;

  updateHole(holeId: string | number, hole: IHole): Promise<void>;

  getBubblesFromHole(holeId: string | number, index: number, offset: number): Promise<BubbleVO[]>;
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
  private static HOLE_COLLECTION: string = "hole";
  private static HOLE_DEFAULT_AVATAR_URL = "";
  private static BUBBLE_COLLECTION: string = "bubble";
  private static REPLY_COLLECTION: string = "reply";

  async createHole(): Promise<string | number> {
    let count = await this.base.collection(HoleApi.HOLE_COLLECTION).count() as ICountResult;
    let index: number = count ? count.total + 1 : 1;
    return await this.base.add(HoleApi.HOLE_COLLECTION, {
      title: `树洞 ${index} 号`,
      avatarUrl: HoleApi.HOLE_DEFAULT_AVATAR_URL
    });
  }

  async deleteHole(holeId: string | number): Promise<void> {
    return await this.base.remove(HoleApi.HOLE_COLLECTION, holeId);
  }

  async getBubblesFromHole(holeId: string | number, index: number, offset: number): Promise<BubbleVO[]> {
    //bubble
    const bubbleCollection = this.base.collection(HoleApi.BUBBLE_COLLECTION);

    let bubbleResult = await bubbleCollection
      .where({holeId})
      .orderBy('createTime', 'desc')
      .skip(index * offset)
      .limit(offset)
      .get() as IQueryResult;

    if (!bubbleResult)
      return [];

    let bubbleVOs: BubbleVO[] = bubbleResult.data.map(result => {
        let bubbleVO: BubbleVO =
          {
            _id: result._id ? result._id : '',
            _openid: result.openid, createTime: result.createTime, content: result.content,
            holeId: result.holeId, replyList: result.replyList, style: result.style, type: result.style,
          };
        return bubbleVO;
      }
    );

    //reply
    const replyCollection = this.base.collection(HoleApi.REPLY_COLLECTION);

    await bubbleVOs.forEach(async bubbleVO => {
      let replyResult = await replyCollection
        .where({bubbleId: bubbleVO._id})
        .orderBy('createTime', 'asc')
        .get() as IQueryResult;

      bubbleVO.replyList = replyResult ?
        replyResult.data.map(result => {
          let replyVO: ReplyVO =
            {
              _id: result._id ? result._id : '',
              _openid: result._openid, bubbleId: result.bubbleId, content: result.content, createTime: result.createTime
            };
          return replyVO;
        }) : [];
    });

    return bubbleVOs;
  }


  async updateHole(holeId: string | number, hole: IHole): Promise<void> {
    return await this.base.update(HoleApi.HOLE_COLLECTION, holeId, hole);
  }

  async getHoles(index: number, offset: number): Promise<IHoleVO[]> {
    //hole
    const holeCollection = this.base.collection(HoleApi.HOLE_COLLECTION);
    let holeResult = await holeCollection
      .orderBy('updateTime', 'desc')
      .skip(index * offset)
      .limit(offset)
      .get() as IQueryResult;

    if (!holeResult)
      return [];

    return holeResult.data.map(result => {
      let holeVO: IHoleVO =
        {
          _id: result._id ? result._id : '',
          _openid: result._openid, avatarUrl: result.avatarUrl, createTime: result.createTime, title: result.title
        };
      return holeVO;
    });
  }
}

/**
 * 假的测试api
 */
export class MockHoleApi implements IHoleApi {

  private http = MockRequest.getInstance();

  createHole(): Promise<string | number> {
    return this.http.success(new Date().getTime());
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
    let holeVOList:IHoleVO[] = [];
    for (let i = 0; i < offset; i++) {
      let id = i + index;
      holeVOList.push({
        _id: id,
        _openid: '' + id,
        createTime: new Date(),
        title: `树洞 ${id} 号`,
        avatarUrl: ''
      });
    }
    return this.http.success(holeVOList);
  }

  // @ts-ignore
  updateHole(holeId: string | number, hole: IHole): Promise<void> {
    return this.http.success();
  }

}
