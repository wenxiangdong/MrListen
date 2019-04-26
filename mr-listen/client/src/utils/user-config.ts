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
  "#3fd1ff",
  "#19be6b",
  "#e47f89",
  "#6190E8",
  "#ef475d",
  "#d2b42c",
  "#2C405A"
];

export {bubbleColorOptions};
