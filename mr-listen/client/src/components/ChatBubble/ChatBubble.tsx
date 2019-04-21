import "./ChatBubble.less";

import {BubbleVO} from "../../apis/HoleApi";
import {View} from "@tarojs/components";
import RightBubble from "./RightBubble";
import UserConfig, {IUserConfig} from "../../utils/user-config";
import LeftBubble from "./LeftBubble";
import Avatar from "./Avatar";
import Logger from "../../utils/logger";
import Taro from "@tarojs/taro";

interface IProp {
  bubble: BubbleVO
}
export default class ChatBubble extends Taro.Component<IProp> {

  // @ts-ignore
  private userConfig:IUserConfig = {};  // 用户的自定义

  private logger = Logger.getLogger(ChatBubble.name);

  constructor(props) {
    super(props);
    this.initUserConfig();
  }


  /**
   * 获取初始化用户配置
   */
  private initUserConfig() {
    this.userConfig = UserConfig.getConfig();
  }

  private rightBubbleMenus = [
    {
      label: "对自己说"
    },
    {
      label: "删除"
    }
  ];

  handleLongPressRightBubble = () => {
    this.logger.info("右气泡被长按了");
    Taro.showActionSheet({
      itemList: this.rightBubbleMenus.map(menu => menu.label),

    }).then(res => {
      this.logger.info(res);
    });
  };

  render(): any {
    const {bubble} = this.props;
    const {bubbleColor} = this.userConfig;

    const rightBubbleWrapper = (
      <View className={"right-flex bubble-item"}>
        <View className={"avatar-wrapper"}>
          <Avatar size={50} />
        </View>
        <RightBubble bubble={bubble} color={bubbleColor} onLongPress={this.handleLongPressRightBubble}/>
      </View>
    );

    const leftBubblesWrapper =
      bubble.replyList.map((r, index) => (
          <View className={"left-flex bubble-item"} key={index}>
            <View className={"avatar-wrapper"}>
              <Avatar size={50} />
            </View>
            <LeftBubble bubble={r} />
          </View>
        ))
    ;

    return (
      <View>
        {rightBubbleWrapper}
        {leftBubblesWrapper}
      </View>
    )
  }
}
