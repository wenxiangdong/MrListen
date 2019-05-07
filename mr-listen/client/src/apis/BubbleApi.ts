import "@tarojs/async-await";
import {MockRequest, VO} from "./HttpRequest";
import Cache from "./Cache";
import Const from "./Const";

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
  _openid: string;
  createTime: number;
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
  _openid: string;
  createTime: number;
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
  private cache: Cache = Cache.getInstance();

  async deleteBubble(bubbleId: string | number): Promise<void> {
    await (await this.cache.collection<BubbleVO>(Const.BUBBLE_COLLECTION)).doc(bubbleId).remove();
  }

  async deleteReply(replyId: string | number): Promise<void> {
    await (await this.cache.collection<ReplyVO>(Const.REPLY_COLLECTION)).doc(replyId).remove();
  }

  async sendBubble(bubble: Bubble): Promise<string | number> {
    return await (await this.cache.collection<BubbleVO>(Const.BUBBLE_COLLECTION)).add(bubble);
  }

  async sendReply(reply: Reply): Promise<string | number> {
    return await (await this.cache.collection<ReplyVO>(Const.REPLY_COLLECTION)).add(reply);
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
    return this.http.success(new Date().getTime());
  }

  // @ts-ignore
  sendReply(reply: Reply): Promise<number> {
    return this.http.success(Math.random());
  }

}
