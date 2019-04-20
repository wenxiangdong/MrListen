import "./ChatBubble.less";
import {Component} from "@tarojs/taro";
import {BubbleVO} from "../../apis/HoleApi";
import * as Taro from "@tarojs/taro";
import {View} from "@tarojs/components";
import RightBubble from "./RightBubble";
import UserConfig, {IUserConfig} from "../../utils/user-config";
import LeftBubble from "./LeftBubble";
import Avatar from "./Avatar";
interface IProp {
  bubble: BubbleVO
}
export default class ChatBubble extends Component<IProp> {

  // @ts-ignore
  private userConfig:IUserConfig = {};  // 用户的自定义

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


  render(): any {
    const {bubble} = this.props;
    const {bubbleColor} = this.userConfig;

    const rightBubbleWrapper = (
      <View className={"right-flex bubble-item"}>
        <View className={"avatar-wrapper"}>
          <Avatar size={50} />
        </View>

        <RightBubble bubble={bubble} color={bubbleColor}/>
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
