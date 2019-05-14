export enum ShareKeys {
  SHARE_HOLE = "share-hole",  // 树洞分享
  SHARE_REPORT = "share-report",  // 报告分享
}


class ShareUtil {
  private store: {[key: string]: any} = {};

  /**
   * 设置分享信息，在app.js的willComponentMount方法里拿到的 scene
   * @param key
   * @param value
   */
  setShareMessage(key: ShareKeys, value: any): void {
    this.store[key.toString()] = value;
  }


  getShareMessage(key: ShareKeys): any {
    return this.store[key.toString()];
  }

  clear(key: ShareKeys): void {
    this.store[key.toString()] = undefined;
  }
}

const shareUtil = new ShareUtil();
export default shareUtil;


