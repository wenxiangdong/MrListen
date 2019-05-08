import Taro, {Component} from "@tarojs/taro";
import ChatBubble from '../ChatBubble/ChatBubble';
import {BubbleStyle, BubbleType, BubbleVO} from "../../apis/BubbleApi";

interface IProp {
  color?: string
}

/**
 * 示例气泡组件
 * @author 张李承
 * @create 2019/4/26 8:31
 */
export default class SampleBubble extends Component<IProp, any> {
  render(): any {
    let sampleBubble:BubbleVO = {
      _id: '0',
      _openid: '0',
      createTime: new Date().getTime(),
      holeId: '0',
      type: BubbleType.TEXT,
      style: BubbleStyle.NORMAL,
      content: '测试内容',
      replyList: []
    };

    return (
      <ChatBubble bubble={sampleBubble} color={this.props.color} />
    )
  }
}

