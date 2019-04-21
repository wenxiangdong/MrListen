import "./ChatBubble.less";

import {BubbleVO} from "../../apis/HoleApi";
import {View} from "@tarojs/components";
import RightBubble from "./Bubble/RightBubble";
import UserConfig, {IUserConfig} from "../../utils/user-config";
import LeftBubble from "./Bubble/LeftBubble";
import Avatar from "./Avatar";
import Logger from "../../utils/logger";
import Taro from "@tarojs/taro";
interface IProp {
  bubble: BubbleVO,
  onLongPressLeftBubble?: (id) => void,
  onLongPressRightBubble?: (id) => void
}
export default class ChatBubble extends Taro.Component<IProp> {

  // @ts-ignore
  private userConfig:IUserConfig = {};  // 用户的自定义

  private logger = Logger.getLogger(ChatBubble.name);

  constructor(props) {
    super(props);
    this.logger.info(props);
    this.initUserConfig();
  }

  /**
   * 获取初始化用户配置
   */
  private initUserConfig() {
    this.userConfig = UserConfig.getConfig();
  }


  // handleLongPressRightBubble = (id) => {
  //   this.logger.info("右气泡被长按了", id);
  // };
  //
  // handleLongPressLeftBubble = (id) => {
  //   this.logger.info("左气泡被长按了", id);
  // };

  render(): any {
    const {bubble, onLongPressLeftBubble, onLongPressRightBubble} = this.props;
    const {bubbleColor} = this.userConfig;

    // 构建右边的气泡
    const rightBubbleWrapper = (
      <View className={"right-flex bubble-item"}>
        <View className={"avatar-wrapper"}>
          <Avatar size={50} />
        </View>
        <RightBubble bubble={bubble} color={bubbleColor} onLongPress={onLongPressRightBubble}/>
      </View>
    );

    // 构建左边的气泡
    const leftBubblesWrapper =
      bubble.replyList.map((r, index) => (
          <View className={"left-flex bubble-item"} key={index}>
            <View className={"avatar-wrapper"}>
              <Avatar size={50} />
            </View>
            <LeftBubble bubble={r} onLongPress={onLongPressLeftBubble} />
          </View>
        ));

    return (
      <View>
        {rightBubbleWrapper}
        {leftBubblesWrapper}
      </View>
    )
  }
}
