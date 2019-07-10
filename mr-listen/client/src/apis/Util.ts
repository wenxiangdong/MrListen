export default abstract class Util {
  static copy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  static copyWithTimestamp<T>(data): T {
    let copyData = Util.copy(data);
    // for (let field in copyData) {
    //   if (typeof copyData[field] === 'string') {
    //     try {
    //       // @ts-ignore
    //       let date = new Date(copyData[field]);
    //       if (date.getTime())
    //         copyData[field] = date.getTime();
    //     } catch (e) {

    //     }
    //   }
    // }
    return copyData;
  }

  private static readonly chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  private static readonly charsLength = Util.chars.length;

  static uuid(length: number = 32): string {
    let uuid = "";
    for (let i = 0; i < length; i++) {
      let index = Math.floor(Math.random() * (Util.charsLength - 1));
      uuid += Util.chars[index];
    }
    return uuid;
  }
}
