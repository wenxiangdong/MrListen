import * as Taro from "@tarojs/taro";

class HelpConfig {
  private KEY = 'mr.listen.help_config';

  public isFirstUse(): boolean {
    return !Taro.getStorageSync(this.KEY);
  }

  public recordFinishHelp(): void {
    Taro.setStorageSync(this.KEY, true);
  }
}

const helpConfig = new HelpConfig();
export default helpConfig;
