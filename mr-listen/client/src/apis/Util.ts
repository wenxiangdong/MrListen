class Util {
  public static copy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  public static copyWithTimestamp<T>(data: object): T {
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


