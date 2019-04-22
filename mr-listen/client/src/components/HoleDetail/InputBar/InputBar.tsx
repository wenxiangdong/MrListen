import "./InputBar.less";
import * as Taro from "@tarojs/taro";
import {Input, View} from "@tarojs/components";
import {Component} from "@tarojs/taro";

interface IState {
  text: string
}

export default class InputBar extends Component<any, IState> {
  render(): any {
    return (
      <View className={"IB-wrapper"}>
        <View className={"IB-style-btn IB-btn"}>
          H
        </View>
        <Input className={"IB-input"} placeholder={"回车发送"} confirmType={"send"} />
        <View className={"IB-add-btn IB-btn"}>
          +
        </View>
      </View>
    );
  }
}
