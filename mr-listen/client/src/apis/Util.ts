class Util {
  static copy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  static copyField(dest: object, src: object) {
    for (let field in src) {
      // noinspection JSUnfilteredForInLoop
      dest[field] = src[field];
    }
  }

  static copyWithTimestamp<T>(data: any): T {
    let copyData = this.copy(data);
    for (let field in copyData) {
      // @ts-ignore
      // noinspection JSUnfilteredForInLoop
      if (copyData[field] instanceof Date) {
        // noinspection JSUnfilteredForInLoop
        copyData[field] = copyData[field].getTime();
      }
    }
    return copyData;
  }


  private constructor() {
  }
}


