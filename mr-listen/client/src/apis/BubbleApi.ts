import "@tarojs/async-await";
import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";
import Cache from "./Cache";
import IQuerySingleResult = Taro.cloud.DB.IQuerySingleResult;

export interface IBubbleApi {
// @return Bubble.id
  sendBubble(bubble: Bubble): Promise<string | number>;

  deleteBubble(bubbleId: string | number): Promise<void>;

// @return Reply.id
  sendReply(reply: Reply): Promise<string | number>;

  deleteReply(replyId: string | number): Promise<void>;
}

export enum BubbleType {
  TEXT,
  PICTURE,
  VOICE
}

export enum BubbleStyle {
  TITLE,
  STRONG,
  NORMAL
}

export interface Reply {
  bubbleId: string | number;
  content: string;
}

export interface ReplyVO extends VO {
  bubbleId: string | number;
  content: string;
}

export interface Bubble {
  holeId: string | number;
  type: BubbleType;
  style: BubbleStyle;
  content: string;
}

export interface BubbleVO extends VO {
  holeId: string | number;
  type: BubbleType;
  style: BubbleStyle;
  content: string;
  replyList: ReplyVO[];
}


/**
 * 真正的api
 */
export class BubbleApi implements IBubbleApi {
  private base: IHttpRequest = HttpRequest.getInstance();
  private cache: Cache = Cache.getInstance();

  // private CONST: IConst = Const.getInstance();

  public async deleteBubble(bubbleId: string | number): Promise<void> {
    //清除缓存
    this.cache.remove(Const.BUBBLE_COLLECTION, bubbleId);
    //删除远端数据
    await this.base.remove(Const.BUBBLE_COLLECTION, bubbleId);
  }

  public async deleteReply(replyId: string | number): Promise<void> {
    this.cache.remove(Const.REPLY_COLLECTION, replyId);
    await this.base.remove(Const.REPLY_COLLECTION, replyId);
  }

  public async sendBubble(bubble: Bubble): Promise<string | number> {
    let id: string | number = await this.base.add(Const.BUBBLE_COLLECTION, bubble);

    let bubbleVOResult = await this.base
      .doc(Const.BUBBLE_COLLECTION, id)
      .get() as IQuerySingleResult;

    if (bubbleVOResult) {
      let bubbleVO: BubbleVO = copy<BubbleVO>(bubbleVOResult.data);
      // noinspection JSIgnoredPromiseFromCall
      this.cache.add(Const.BUBBLE_COLLECTION, bubbleVO);
    }

    return id;
  }

  public async sendReply(reply: Reply): Promise<string | number> {
    let id: string | number = await this.base.add(Const.REPLY_COLLECTION, reply);

    let replyVOResult = await this.base
      .doc(Const.REPLY_COLLECTION, id)
      .get() as IQuerySingleResult;

    if (replyVOResult) {
      let replyVO: ReplyVO = copy<ReplyVO>(replyVOResult.data);
      // noinspection JSIgnoredPromiseFromCall
      this.cache.add(Const.REPLY_COLLECTION, replyVO);
    }

    return id;
  }
}


/**
 * 假的测试api
 */
export class MockBubbleApi implements IBubbleApi {

  private http = MockRequest.getInstance();

  // @ts-ignore
  deleteBubble(bubbleId): Promise<void> {
    return this.http.success();
  }

  // @ts-ignore
  deleteReply(replyId): Promise<void> {
    return this.http.success();
  }

  // @ts-ignore
  sendBubble(bubble: Bubble): Promise<number> {
    return this.http.success(0);
  }

  // @ts-ignore
  sendReply(reply: Reply): Promise<number> {
    return this.http.success(0);
  }

}

function copy<T>(data: object): T {
  return JSON.parse(JSON.stringify(data));
}
