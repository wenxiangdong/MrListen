import "@tarojs/async-await";
import {HttpRequest, IHttpRequest, MockRequest, VO} from "./HttpRequest";

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

  private static BUBBLE_COLLECTION: string = "bubble";
  private static REPLY_COLLECTION: string = "reply";

  public async deleteBubble(bubbleId: string | number): Promise<void> {
    return await this.base.remove(BubbleApi.BUBBLE_COLLECTION, bubbleId);
  }

  public async deleteReply(replyId: string | number): Promise<void> {
    return await this.base.remove(BubbleApi.REPLY_COLLECTION, replyId);
  }

  public async sendBubble(bubble: Bubble): Promise<string | number> {
    return await this.base.add(BubbleApi.BUBBLE_COLLECTION, bubble);
  }

  public async sendReply(reply: Reply): Promise<string | number> {
    return await this.base.add(BubbleApi.REPLY_COLLECTION, reply);
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
