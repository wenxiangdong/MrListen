```typescript
// 所有对象的创建时间属性为 createTime, 最新一次更新时间属性为 updateTime，无需设置，调用 HttpRequest 对应时自动添加，如 add 方法
/**
  async add(collectionName: string, data: object = {}): Promise<string | number> {
    data['createTime'] = this.database.serverDate();
    let result = await this.database.collection(collectionName).add({data}) as IAddResult;

    if (result)
      return result._id;
    else {
      const errMsg = `插入 ${collectionName} ${JSON.stringify(data)} 失败`;
      this.logger.error(errMsg);
      throw new Error(errMsg);
    }
  }
*
*/

// 所有通过直接操作数据库获取数据的 VO 的父类
interface VO {
  _id: string | number; // 插入数据 id
  _openid: string | number; // 数据创建者
  createTime: number; // 创建时间
  updateTime: number; // 更新时间
}

interface UserVO extends VO {
  
}

enum BubbleType {
  TEXT,
  PICTURE,
  VOICE
}

enum BubbleStyle {
  TITLE,
  STRONG,
  NORMAL
}

interface Reply {
    bubbleId: string | number;
    content: string;
}

interface ReplyVO extends VO {
    bubbleId: string | number;
    content: string;
}

interface Bubble {
  holeId: string | number;
  type: BubbleType;
  style: BubbleStyle;
  content: string;
}

interface BubbleVO extends VO {
  holeId: string | number;
  type: BubbleType;
  style: BubbleStyle;
  content: string;
  replyList: ReplyVO[];
}


interface IHole {
  title: string;
  avatarUrl: string;
}

interface IHoleVO extends VO {
    title: string;
    avatarUrl: string;
}

class Hole implements IHole {}

class HoleVO implements IHoleVO {}

class HistoryHole implements IHole {}

class HistoryHoleVO implements IHoleVO {}

interface Report {
    meetTime: number;
    holeCount: number;
    longestDuration: number;
    mostUsedWords: {[key: string]: number};
    latestTime: number;
    plusOneCount: number;
}

interface ShareHoleVO extends VO {
    expireIn: number;
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



enum HttpCode {
  SUCCESS,
  AUTHENTICATION_ERROR,
  NOT_FOUND,
  ERROR
}

// 调用云函数的返回结构
class HttpResponse<T> {
  code: HttpCode;
  data: T;
  message: string;
}

// api

interface IUserApi {
    /** 
    * @return string 新用户id 或已注册 id
    */
    login(): string | number;
}


interface IBubbleApi {
    /**
    * 
    * @param bubble 消息
    * @return string 新 bubble id
    * 
    */
    sendBubble(bubble: Bubble): string | number;
    
    /**
    * 
    * @param bubbleId
    * 
    */
    deleteBubble(bubbleId: string | number): void;
    
    /**
    * 
    * @param reply
    * @return 新 reply id
    * 
    */
    sendReply(reply: Reply): string | number;
    
    /**
    * 
    * @param replyId
    * 
    */
    deleteReply(replyId: string| number): void;
}

interface IHoleApi {
    /**
    * @return 新树洞id
    */
    createHole(): string | number;
    
    /**
    * 
    * @param lastHoleId 上次获取的最后一个holeId，如果是第一次获取，请传入空：''，0 都可以
    * @param offset 该页取多少数据量，默认为20
    * @return Hole[] 树洞集合
    * 
    */
    // 根据 Hole 更新时间逆序，即最近访问的树洞返回优先级最高
    getHoles(lastHoleId: string| number, offset: number = 20): IHoleVO[];
    
    /**
    * 
    * @param holeId
    * 
    */
    deleteHole(holeId: string | number): void;
    
    /**
    * 
    * @param holeId
    * @param hole
    * @return 更新后的树洞
    * 
    */
    //  Hole 数据结构中没有id, 所以需要添加 holeId, 其余更新操作同理
    updateHole(holeId: string | number, hole: IHole): void;
    
    /**
    * 
    * @param holeId
    * @return 添加了对应 reply 的 bubble 集合
    */
    //创建时间顺序获取
    getBubblesFromHole(holeId: string | number): BubbleVO[];
}

interface IFileApi {
    /**
    * 
    * @param cloudPath 上传的云端路径
    * @param filePath 本地资源路径
    * @return 云文件 ID
    */
    uploadFile(cloudPath: string, filePath: string): Promise<string>;
    
    downloadFile(fileID: string): Promise<string>;
    
    getTempFileURL(fileList: string[]): Promise<object[]>;
    
    deleteFile(fileList: string[]): Promise<object[]>;
}

interface ShareHoleApi {
    
    createShareHole(holeId: string | number, expireIn: number = -1): string | number;
    
    getShareHole(shareHoleId: string | number): ShareHoleVO;
    
    plusOneCount(shareHoleId: string | number): void;
}

```

