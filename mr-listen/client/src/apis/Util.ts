export default abstract class Util {
  static copy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  static copyWithTimestamp<T>(data): T {
    let copyData = Util.copy(data);
    for (let field in copyData) {
      if (typeof copyData[field] === 'string') {
        try {
          // @ts-ignore
          let date = new Date(copyData[field]);
          if (date.getTime())
            copyData[field] = date.getTime();
        } catch (e) {

        }
      }
    }
    return copyData;
  }
}
