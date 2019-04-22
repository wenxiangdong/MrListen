import Taro from "@tarojs/taro";
import {Image, View} from "@tarojs/components";
import svgPicture from "../../../../images/picture.svg";
import "./BubbleType.less";
import Logger from "../../../../utils/logger";
import {HttpRequest} from "../../../../apis/HttpRequest";
import Listen from "../../../../utils/listen";
import {Bubble, BubbleStyle, BubbleType} from "../../../../apis/BubbleApi";

interface IProp {
  onSend: (bubble: Bubble) => void;
}

export default class BubbleTypePicture extends Taro.Component<IProp> {

  private logger = Logger.getLogger(BubbleTypePicture.name);
  private request = new HttpRequest();

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
        // 选完就上传到云
        Listen.showLoading("正在上传图片");
        this.request.uploadFile("bubble-pictures", tempFilePaths[0])
          .then((file) => {
            Listen.hideLoading();
            Listen.message.success("上传成功");
            // 触发事件
            const bubble = this.createBubble(file);
            this.props.onSend(bubble);
          })
          .catch(() => {
            Listen.hideLoading();
            Listen.message.error("请重试");
          });
      })
      .catch(e => {
        const {errMsg = ""} = e;
        // 是不是取消了
        if (!errMsg.includes("cancel")) {
          this.logger.error(e);
        } else {
          Listen.message.error("请重新选择图片");
        }
      })
  }
}
