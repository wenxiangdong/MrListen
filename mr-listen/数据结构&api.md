```typescript
class User {
  _id: number | string;
  openId: string;
  createTime: long;
}

enum BubbleType {
  TEXT,
  PICTURE,
  VOICE;
}

enum BubbleStyle {
  TITLE,
  STRONG,
  NORMAL;
}

class Bubble {
  _id: number | string;
  holeId: int;
  type: BubbleType;
  style: BubbleStyle;
  content: string;
  sendTime: long;
}

class Reply {
  _id: number | string;
  holeId: int;
  bubbleId: int;
  content: string;
  sendTime: long;
}

interface IHole {
   _id: number | string;
  userId: int;
  createTime: long;
  updateTime: long;
  title: string;
  avatarUrl: string;
}

class Hole implements IHole {}

class HistoryHole implements Hole {}

enum HttpCode {
  SUCCESS,
  AUTHENCATION_ERROR,
  NOT_FOUND,
  ERROR;
}

class HttpResponse<T> {
  code: HttpCode;
  data: T;
  message: string;
}


```

```typescript


// post
login(code: string): void;

// post
// @return Bubble.id
sendBubble(bubble: Bubble, holeId: int): number;
// post
deleteBubble(bubbleId): void;

// post
// @return Reply.id
sendReply(content: string, bubbleId: int, holeId: int): int;
// post
deleteReply(replyId: int): void;

// post
createHole(): number;
// get
getHoles(index: int, offset: int): Hole[];
// post
deleteHole(holeId: int): void;
// post
updateHole(hole: Hole): void;


class BubbleVO {
  ...Bubble;
	replyList: Reply[];
}
// get
getBubblesFromHole(index: int, offset: int): BubbleVO[];

// post
uploadFile(holeId: int): string;


```

