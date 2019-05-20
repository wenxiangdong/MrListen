/**
 * 用户个性化设置的存取
 */
import * as Taro from "@tarojs/taro";

interface themeOption {
  mode: string,
  text: string,
  coverImg: string
}

export interface IUserConfig {
  bubbleColor?: string,
  theme?: themeOption,
  shakeOff?: boolean,
  avatarUrl?: string,
  nickName?: string
}
class UserConfig {
  private KEY = "mr.listen.user_config";
  private defaultConfig: IUserConfig = {
    bubbleColor: "#42A5F5",
    theme: {mode: "color-stripe-candy", text: "糖果条纹", coverImg: candyImgBase64},
    shakeOff: true,
    avatarUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1557061508&di=55b378f85ecea0d581a6b61c11ea2258&src=http://www.uedsc.com/wp-content/uploads/2015/12/2012122836181345.jpg",
    nickName: "无昵称"
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

// 这样写方便外面导入，有提示
const userConfig = new UserConfig();
export default userConfig;

let bubbleColorOptions: string[] = [
  // 这是原先的颜色列表
  // "#1E88E5",
  // "#19be6b",
  // "#EC407A",
  // "#E65100",
  // "#0288D1",
  // "#43A047",
  // "#9C27B0",
  // "#F4511E",
  // "#0097A7",
  // "#558B2F",
  // "#EF5350",
  // "#009688",
  // "#616161",
  // "#9575CD",
  // "#546E7A",
  // "#558B2F",
  // "#5C6BC0",
  // "#8D6E63",
  // 这是cyf编写的颜色列表
  "#03A9F4",
  "#4CAF50",
  "#8BC34A",
  "#FFC107",
  "#FF9800",
  "#FF7043",
];



const candyImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAHmBAMAAABdYO13AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAAKlBMVEX////+e3lP48L/t7ro6u7a5kuc4ej/8PHr+Pr/9PP9/f7x/Pr8/fH8/fCx7RYvAAAC2UlEQVR42u3SoRGEQBBFwcUgcKSARSKwCFIghYuDEC6pDWHzwY5YBAKou+qnf43ompSu1/Sxb300xeaTS2WLnYyG2FjftJ/YXh91a2xJjwQLFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsP4IK8OCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBeuHsAosn+WzfJbPggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggXrFqwMCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIF622sAgsWLFiwYMGCBQsWLFiwYMGCBQsWrLuwDueQRdDbhPEUAAAAAElFTkSuQmCC"

let themeOptions: themeOption[] = [
  {mode: "color-stripe-candy", text: "糖果条纹", coverImg: candyImgBase64},
  // {mode: "music", text: "音乐律动", coverImg: candyImgBase64},
];

export {
  bubbleColorOptions,
  themeOptions
};
