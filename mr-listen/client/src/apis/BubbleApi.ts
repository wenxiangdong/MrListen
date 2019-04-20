import {HttpRequest, IHttpRequest, MockRequest} from "./HttpRequest";
import "@tarojs/async-await";

export interface IBubbleApi {
  // post
// @return Bubble.id
  sendBubble(bubble: Bubble, holeId: number): Promise<number>;
// post
  deleteBubble(bubbleId): Promise<void>;
// post
// @return Reply.id
  sendReply(content: string, bubbleId: number, holeId: number): Promise<number>;
// post
  deleteReply(replyId: number): Promise<void>;
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

export interface Bubble {
  id: number;
  holeId: number;
  type: BubbleType;
  style: BubbleStyle;
  content: string;
  sendTime: number;
}

export interface Reply {
  id: number;
  holeId: number;
  bubbleId: number;
  content: string;
  sendTime: number;
}


/**
 * 真正的api
 */
export class BubbleApi implements IBubbleApi {


  private base: IHttpRequest = new HttpRequest();
  constructor() {}

  async deleteBubble(bubbleId: number): Promise<void> {
    return this.base.request("deleteBubble", {bubbleId});
  }

  async deleteReply(replyId: number): Promise<void> {
    return this.base.request("deleteReply", {replyId});
  }

  async sendBubble(bubble: Bubble, holeId: number): Promise<number> {
    return this.base.request<number>("sendBubble", {bubble, holeId});
  }

  async sendReply(content: string, bubbleId: number, holeId: number): Promise<number> {
    return this.base.request<number>("sendReply", {content, bubbleId, holeId});
  }

}


/**
 * 假的测试api
 */
export class MockBubbleApi implements IBubbleApi {

  private http = new MockRequest();

  // @ts-ignore
  deleteBubble(bubbleId): Promise<void> {
    return this.http.success();
  }

  // @ts-ignore
  deleteReply(replyId: number): Promise<void> {
    return this.http.success();
  }

  // @ts-ignore
  sendBubble(bubble: Bubble, holeId: number): Promise<number> {
    return this.http.success(0);
  }

  // @ts-ignore
  sendReply(content: string, bubbleId: number, holeId: number): Promise<number> {
    return this.http.success(0);
  }

}
