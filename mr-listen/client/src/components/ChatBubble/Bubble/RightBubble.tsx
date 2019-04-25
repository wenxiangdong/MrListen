import Taro from "@tarojs/taro";
import {Bubble, BubbleType} from "../../../apis/BubbleApi";
import {Block, Image, Text, View} from "@tarojs/components";
import "./RightBubble.less";
import SendTime from "./SendTime";
import Listen from "../../../utils/listen";
import zoomPng from "../../../images/zoom.png";

interface IProp {
  bubble: Bubble,
  color: string,
  onLongPress?: (id) => void
}

class RightBubble extends Taro.Component<IProp> {

  render(): any {
    const {bubble, color} = this.props;
    let bubbleContent;
    switch (bubble.type) {
      case BubbleType.TEXT: {
        bubbleContent = <Text className={"Right-text bubble-text"}>{bubble.content}</Text>;
        break;
      }
      case BubbleType.PICTURE: {
        bubbleContent = <Block>
          <Image
            src={bubble.content}
            className={"Right-image"}
            mode={"aspectFill"}/>
          <Image className={"Right-zoom-icon"} src={zoomPng} onClick={this.handleClickImage}/>
        </Block>;
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
  };

  handleClickImage = () => {
    const {bubble} = this.props;
    Taro.previewImage({
      urls: [bubble.content]
    }).catch(() => {
      Listen.message.error("预览图片失败");
    })
  };
}

export default RightBubble;