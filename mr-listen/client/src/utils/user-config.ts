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
    theme: {mode: "default", text: "无动态背景", coverImg: emptyImgBase64},
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


const emptyImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAAtJREFUCJlj+A8EAAn7A/3jVfKcAAAAAElFTkSuQmCC";
const candyImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAHmBAMAAABdYO13AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAAKlBMVEX////+e3lP48L/t7ro6u7a5kuc4ej/8PHr+Pr/9PP9/f7x/Pr8/fH8/fCx7RYvAAAC2UlEQVR42u3SoRGEQBBFwcUgcKSARSKwCFIghYuDEC6pDWHzwY5YBAKou+qnf43ompSu1/Sxb300xeaTS2WLnYyG2FjftJ/YXh91a2xJjwQLFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsP4IK8OCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBeuHsAosn+WzfJbPggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggXrFqwMCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIF622sAgsWLFiwYMGCBQsWLFiwYMGCBQsWrLuwDueQRdDbhPEUAAAAAElFTkSuQmCC"
const bubbleImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAACpCAMAAABznnP8AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAADAFBMVEX/////s7PV6bjw9+aT1f/l8uW32rmUypbG4Z/Ov9P/rq3///+2z+z/ubnF4Z+Nxo//q6z/wsL/z87/4uL/9fXttbvfzKXW7//PvdDTxdb+3dzG3p/B35////+VypfG4Z//3J7/rq6T1v+YzJrPwNT//fbP6vuTyZWNxo//qamRyJP/25z/p6f/ra2Px5KMxo6Ox5CSyZSS1v///PX/2pn/3J2Uypb///aJxYyXzJr//fr///7/q6v/rKzF4Z2Lxo2Vy5r/2Zj/2ZbG4Z7/2pr///2Q1f+N1P/K45/I4p//2ZXC4JjE4Zz//vz9/v7/pqb/9ub4/PfM6vzE4Jqt1q7D4Jmf0KGj0aX7/frPv9PP7v39/vz/3qLF4sbQ6NHv9+/Q7PzPvdL2+vbh8OHO6vzW7vr8/PX/z86L0/+Wy5n//Pi02bXX6rr/sLD/7u2I0v//7Mvy+fH/8/P/xsbC5p7F5J//5rr/68f/6cD/25v/4rDT6dTZ7NnH4Z+G0f+x4P6c2f//8dn/4av3+/GczpzM5s3/36bc7tyazZyZzZun05ym0qfO5a3/s7T/wcDMwdex2LP/9OH/9fWez53/4OC63Lv/t7b/pKTU7fvPzN7d8fv/urqK0v//7tD/2ZS+37+83b70+fSs1p3t9u3/vr3m8tTS7v+I1v/B5/7xu6r/q67E4cT/8t3o8+jr9ev/3d3s+P+q3///79TI48nV6tbe79//+OuLxo7a7MH/ysm73J3F4p//1dTw9/jP4PH/2djp9NqY1//P2Or/6Oeg2//7sa//razx+v//5bfL5Kep1Kv/5LXp9Or/+/vD4J/J46P0+evs9t/J6//H5vrbvMvUv9H/+/LB4MP/+Pi12Z2/35685f/R5/bY8f/Qw9fKxtzQ2aLysrjptsD4/f/K5Mv/+e7p9fnj8M/A4MHR57G72fPO6f3e7cbU1OTL3aDk9f//6urg78vk8/m54vyF0f//qa/fzKXRwNL/5OLB3PWh1fnZ0qWl0pXty7Pqubb/7+Je7LsbAAAAhXRSTlPy8v7+8v7+8vLy8ub88vLy8vLy8vLy8vLy8vn5+//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+iG/wKgAAECRJREFUeNrt3XlUE3ceAHBWF3a7bbfbY68/ZkigkskkmSRA0ig5JEaoBAiRUzlUaOUWLMotKqigYBcPxBbPKi31QPG22ir1vopH1R7bU63atVW329bt7r63kwBhJuSY+YWZJD6/7/lUfIx83vf3+/6O+WXG53Gfhzge94Ee6vDxebh1j3iPeI94j3iPeI94j3hMhHFDVtXOq2vX3krPqN+6/uHira++mpAEoxKxRrMXwXjzTrdkdD40vM6dyahYLMFQHk8u5/GkKIaIsXktWakPA+/srWXivShPDhNDLkUU8ub6MG/nGXc2iCU82EbIMY3Ur9O7eb4JexGbuF6gYl5VmBfzqhYqUNhByMXYukxv5YWlY2I57DgwRcJ07+TFbkYQ2GmgzPmY5aUjGEwhpJqESV7Iy5BIYEohVTSneB0vC0ZgioGK072Nt75RAVMOCVrtZbyrGh51HqxJXu9VvCxYQkOHl5d0b+Kl5ivkdHgw0nDWi3i7eRgtHczTXAX5f1KMdefPn6+rmzqWVV4LzeTh6UuiOfilnL9wc9+w202nTp1qahq27/7h8yls8c42SGjqYCmSYX/VcXZ31fz5xEX+2PM3C5pmxev1ib2B/0F9atj9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";

let themeOptions: themeOption[] = [
  {mode: "default", text: "无背景", coverImg: emptyImgBase64},
  {mode: "color-stripe-candy", text: "糖果条纹", coverImg: candyImgBase64},
  {mode: "bubbles", text: "雨天", coverImg: bubbleImageBase64},
];

export {
  bubbleColorOptions,
  themeOptions
};
