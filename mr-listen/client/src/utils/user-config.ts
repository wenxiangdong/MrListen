/**
 * 用户个性化设置的存取
 */
import * as Taro from "@tarojs/taro";

export interface IUserConfig {
  bubbleColor: string,
  themeColor: string
}
class UserConfig {
  private KEY = "user-config";
  private defaultConfig: IUserConfig = {
    bubbleColor: "#19be6b",
    themeColor: "#19be6b"
  };
  public getConfig(): IUserConfig {
    let config = Taro.getStorageSync(this.KEY) || this.defaultConfig;
    return config;
  }

  public setConfig(config: IUserConfig): void {
    const combineConfig = {...this.defaultConfig, ...config};
    Taro.setStorageSync(this.KEY, combineConfig);
  }
}

export default new UserConfig();

let bubbleColorOptions: string[] = [
  "#1E88E5",
  "#19be6b",
  "#EC407A",
  "#E65100",
  "#0288D1",
  "#43A047",
  "#9C27B0",
  "#F4511E",
  "#0097A7",
  "#558B2F",
  "#EF5350",
  "#009688",
  "#616161",
  "#9575CD",
  "#E65100",
  "#546E7A",
  "#558B2F",
  "#5C6BC0",
  "#8D6E63",
];

let themeColorOptions = bubbleColorOptions;

export {
  bubbleColorOptions,
  themeColorOptions
};
