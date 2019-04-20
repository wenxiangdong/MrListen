import {Component} from "@tarojs/taro";
import {Reply} from "../../apis/BubbleApi";
import * as Taro from "@tarojs/taro";
import {View, Text} from "@tarojs/components";
import "./LeftBubble.less";
import SendTime from "./SendTime";

interface IProp {
  bubble: Reply
}
class LeftBubble extends Component<IProp> {
  render(): any {
    const {bubble} = this.props;
    return (
      <View className={"Left-wrapper bubble"}>
        <Text className={"bubble-text"}>{bubble.content}</Text>
        <SendTime time={bubble.sendTime}/>
      </View>
    )
  }
}

export default LeftBubble;
