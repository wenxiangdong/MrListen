// 对一些常用工具方法的封装
// 如showToast之类的

import * as Taro from "@tarojs/taro";

import successPng from "../images/success.png";
// import infoPng from "../images/info.png";
import errorPng from "../images/failed.png";

interface IMessage {
  success(msg): void;
  error(msg): void;
  info(msg): void;
}

class Message implements IMessage {
  public success(msg): void {
    this.show(msg, successPng);
  }

  public error(msg): void {
    this.show(msg, errorPng);
  }

  public info(msg): void {
    this.show(msg);
  }

  private show(msg, icon?): void {
    if (!icon) {
      Taro.showToast({
        title: msg,
        icon: "none",
        mask: true
      });
    } else {
      Taro.showToast({
        title: msg,
        image: icon,
        mask: true
      });
    }
  }
}

export default class Listen {

  /**
   * 显示加载中
   * @param title
   */
  public static showLoading(title): Promise<any> {
    return Taro.showLoading({
      title,
      mask: true
    });
  }

  public static hideLoading() {
    Taro.hideLoading();
  }

  public static message: IMessage = new Message();

  public static showActionSheet(param: Taro.showActionSheet.Param) {
    return Taro.showActionSheet(param);
  }
}

