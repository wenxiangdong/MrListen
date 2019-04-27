import {Component} from "@tarojs/taro";
import * as Taro from "@tarojs/taro";
import {View, Text} from "@tarojs/components";
import "./LeftBubble.less";
import SendTime from "./SendTime";
import {CommonEvent} from "@tarojs/components/types/common";
import {ReplyVO} from "../../../apis/BubbleApi";
import Logger from "../../../utils/logger";

interface IProp {
  bubble: ReplyVO,
  onLongPress: (id, e?: CommonEvent) => void // 返回这个回复的id
}
class LeftBubble extends Component<IProp> {
  private logger = Logger.getLogger(LeftBubble.name);

  render(): any {
    const {bubble} = this.props;
    this.logger.info(this.props);
    return (
      <View className={"Left-wrapper bubble"} onLongPress={this.handleLongPress}>
        <Text className={"bubble-text"}>{bubble.content}</Text>
        <SendTime time={bubble.createTime}/>
      </View>
    )
  }

  handleLongPress = (e) => {
    e.stopPropagation();
    const {onLongPress = () => null, bubble} = this.props;
    onLongPress(bubble && bubble._id);
  }
}

export default LeftBubble;
