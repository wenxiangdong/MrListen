import Taro from "@tarojs/taro";
import {BubbleType} from "../../../apis/BubbleApi";
import {Block, Image, Text, View} from "@tarojs/components";
import "./RightBubble.less";
import Listen from "../../../utils/listen";
import zoomPng from "../../../images/zoom.png";
import {CommonEvent} from "@tarojs/components/types/common";
import AudioContent from "./AudioContent";

interface IProp {
  bubble: any,
  color: string,
  onLongPress?: (id, e: CommonEvent) => void
}

class RightBubble extends Taro.Component<IProp> {

  render(): any {
    const {bubble = {}, color} = this.props;
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
        // bubbleContent = <Text className={"Right-text"}>这是一段语音</Text>;
        bubbleContent = (<AudioContent content={bubble.content}/>);
        break;
      }
    }

    return (
      <Block>
        <View onLongPress={this.handleLongPress} className={`Right-wrapper bubble`} style={{backgroundColor: color}}>
          {bubbleContent}
          <View className={'bubble-triangle'} style={{
            borderLeft: '6px solid '+ color
          }}/>
          {/*<SendTime time={bubble.createTime} textColor={"black"}/>*/}
        </View>
      </Block>
    )
  }

  handleLongPress = (e) => {
    const {onLongPress = () => null, bubble} = this.props;
    e.stopPropagation();
    onLongPress(bubble && bubble._id, e);
  };

  handleClickImage = () => {
    const {bubble} = this.props;
    Taro.previewImage({
      urls: [bubble.content]
    }).catch(() => {
      Listen.message.error("预览图片失败");
    })
  };

  handleClickAudio = (e) => {
    e.stopPropagation();

  }
}

export default RightBubble;
