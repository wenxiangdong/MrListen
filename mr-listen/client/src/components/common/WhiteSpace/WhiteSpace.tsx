// 这是一个留白的组件
import Taro, {Component} from "@tarojs/taro";
import {View} from "@tarojs/components";

interface IProp {
  height: number
}
export default class WhiteSpace extends Component<IProp> {
  render(): any {
    return (
      <View style={{width: "100vw", height: this.props.height + "px"}}/>
    );
  }
}
