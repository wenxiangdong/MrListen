import Taro from "@tarojs/taro";
import {Image, View} from "@tarojs/components";
import svgPicture from "../../../../images/picture.svg";
import "./BubbleType.less";
import Logger from "../../../../utils/logger";
import Listen from "../../../../utils/listen";
import {Bubble, BubbleStyle, BubbleType} from "../../../../apis/BubbleApi";

interface IProp {
  onSend: (bubble: Bubble) => void;
}

export default class BubbleTypePicture extends Taro.Component<IProp> {

  private logger = Logger.getLogger(BubbleTypePicture.name);

  componentDidMount(): void {
    this.logger.info("mount");
  }

  render() {
    return (
      <View className={"BT-wrapper"} onClick={this.handleClick}>
        <Image src={svgPicture} className={"BT-image"}/>
      </View>
    );
  }

  /**
   * 生成一个气泡数据
   * @param content
   */
  private createBubble(content): Bubble {

    return {
      // @ts-ignore
      _id: "",
      holeId: "",
      content: content,
      sendTime: new Date().getTime(),
      style: BubbleStyle.NORMAL,
      type: BubbleType.PICTURE
    }
  }

  handleClick = () => {
    // 先选择图片
    Taro.chooseImage({count: 1})
      .then(res => {
        this.logger.info(res);
        const {tempFilePaths = []} = res || {};
        // 触发事件
        const bubble = this.createBubble(tempFilePaths[0]);
        this.props.onSend(bubble);
      })
      .catch(e => {
        const {errMsg = ""} = e;
        this.logger.error(e);
        // 是不是取消了
        if (!errMsg.includes("cancel")) {
          Listen.message.error("请重新选择图片");
        }
      })
  }
}
