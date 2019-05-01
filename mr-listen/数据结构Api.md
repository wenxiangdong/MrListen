```typescript
// 所有通过直接操作数据库获取数据的 VO 的父类

/**
* 考虑到有些数据由服务器端生成，故只保留 _id
*/
interface VO {
  _id: string | number; // 插入数据 id
}

interface UserVO extends VO {
    // 与 _openid 意义相同，但由于是服务端创建，故用 openid 表示，其他对象属性中的 openid 同理（服务端无法直接操作对象的 _openid 属性）
    openid: string | number;
    createTime: number;
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
    _openid: string | number;
    createTime: number;
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
    _openid: string | number;
    createTime: number;
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
    _openid: string | number;
    createTime: number;
    title: string;
    avatarUrl: string;
}

class Hole implements IHole {}

class HoleVO implements IHoleVO {}

class HistoryHole implements IHole {}

class HistoryHoleVO implements IHoleVO {}

interface ReportVO extends VO {
    openid: string | number;
    meetTime: number; 
    holeCount: number;
    longestDuration: number;
    /* 数组，每个元素也为数组，元素数组第一项为词语，第二项为出现次数，如
    * [ [ '开心', 20 ], [ '难过', 12 ] ]
    */
    mostUsedWords: Array<Array<string | number>>;
    latestTime: number;
    plusOneCount: number;
}

interface ShareHoleVO extends VO {
    // 到期时间，与 createShareHole 方法中的参数 expireIn 不同，该属性为到期时间点 expireIn 为分享树洞持续的时间（以天数为单位），比如 7 天
    // 该属性由服务器时间和 expireIn 计算得到
    expiryTime: number 
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
    /**
    * 
    * @param holeId
    * @param expireIn 持续天数，默认为-1，表示永不过期
    */
    createShareHole(holeId: string | number, expireIn: number = -1): string | number;
    
    getShareHole(shareHoleId: string | number): ShareHoleVO;
    
    plusOneCount(shareHoleId: string | number): void;
}

```

