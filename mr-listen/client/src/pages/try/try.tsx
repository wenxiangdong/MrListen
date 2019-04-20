import * as Taro from "@tarojs/taro";
import {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import RightBubble from "../../components/ChatBubble/RightBubble";
import {Bubble, BubbleStyle, BubbleType, Reply} from "../../apis/BubbleApi";
import LeftBubble from "../../components/ChatBubble/LeftBubble";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import {BubbleVO} from "../../apis/HoleApi";

export default class Try extends Component {

  config: Config = {
    navigationBarTitleText: "尝试"
  };

  private bubble: BubbleVO = {
    _id: 1,
    type: BubbleType.TEXT,
    style: BubbleStyle.NORMAL,
    content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内内容内容内容",
    sendTime: new Date().getTime(),
    replyList: [{
      content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内内容内容内容",
      sendTime: new Date().getTime()
    }]
  };

  render(): any {
    return (
      <View>
        <ChatBubble bubble={this.bubble}/>
      </View>
    )
  }
}
