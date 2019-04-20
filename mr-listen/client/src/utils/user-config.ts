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
