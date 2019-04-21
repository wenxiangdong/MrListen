import * as Taro from "@tarojs/taro";
import {Component} from "@tarojs/taro";
import {Bubble, BubbleType} from "../../../apis/BubbleApi";
import {Image, Text, View} from "@tarojs/components";
import "./RightBubble.less";
import SendTime from "./SendTime";

interface IProp {
  bubble: Bubble,
  color: string,
  onLongPress?: (id) => void
}

class RightBubble extends Component<IProp> {

  render(): any {
    const {bubble, color} = this.props;
    let bubbleContent;
    switch (bubble.type) {
      case BubbleType.TEXT: {
        bubbleContent = <Text className={"Right-text bubble-text"}>{bubble.content}</Text>;
        break;
      }
      case BubbleType.PICTURE: {
        bubbleContent = <Image src={bubble.content} className={"Right-image"}/>;
        break;
      }
      case BubbleType.VOICE: {
        bubbleContent = <Text className={"Right-text"}>这是一段语音</Text>;
        break;
      }
    }

    return (
      <View onLongPress={this.handleLongPress} className={"Right-wrapper bubble"} style={{backgroundColor: color}}>
        {bubbleContent}
        <SendTime time={bubble.sendTime} textColor={"white"}/>
      </View>
    )
  }

  handleLongPress = (e) => {
    const {onLongPress = () => null, bubble} = this.props;
    e.stopPropagation();
    onLongPress(bubble && bubble._id);
  }
}

export default RightBubble;
