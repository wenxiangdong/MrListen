import "./ChatBubble.less";

import {BubbleVO} from "../../apis/BubbleApi";
import {View} from "@tarojs/components";
import RightBubble from "./Bubble/RightBubble";
import UserConfig, {IUserConfig} from "../../utils/user-config";
import LeftBubble from "./Bubble/LeftBubble";
import Logger from "../../utils/logger";
import Taro from "@tarojs/taro";
import "@tarojs/async-await";
import {apiHub} from "../../apis/ApiHub";
import Listen from "../../utils/listen";
import InputModal from "../../components/common/InputModal/InputModal";
import UserAvatar from "../common/UserAvator/UserAvatar";
import BubbleStyleConfig from "../../utils/bubble-style-config";
import FullScreenEmojiFactory from "../FullScreenAnimation/FullScreenEmojiFactory";

interface IProp {
  bubble: BubbleVO,
  onUpdate?: (bubble) => void,
  hideAvatar?: boolean
}
interface IState {
  showInputModal: boolean
}
export default class ChatBubble extends Taro.Component<IProp, IState> {

  // @ts-ignore
  private userConfig:IUserConfig = {};  // 用户的自定义

  private logger = Logger.getLogger(ChatBubble.name);

  // static externalClasses = ['chat-bubble-class'];

  constructor(props) {
    super(props);
    this.initUserConfig();
  }

  state = {
    showInputModal: false
  };

  /**
   * 获取初始化用户配置
   */
  private initUserConfig() {
    this.userConfig = UserConfig.getConfig();
  }


  handleLongPressRightBubble = async (id) => {
    this.logger.info("右气泡被长按了", id);
    // 如果没有更新回调，则不做任何事
    if (!this.props.onUpdate) {
      return;
    }
    let tapIndex = -1;
    try {
      tapIndex = (await Taro.showActionSheet({
        itemList: ["对过去的自己说", "删除"]
      })).tapIndex;
    } catch (e) {
      this.logger.info("取消");
    }
    const actions = [this.handleReplyBubble , this.handleDeleteBubble];
    const action = actions[tapIndex];
    if (action) {
      action(id);
    }
  };

  handleLongPressLeftBubble = async (id) => {
    this.logger.info("左气泡被长按了", id);
    // 如果没有更新回调，则不做任何事
    if (!this.props.onUpdate) {
      return;
    }
    try {
      await Taro.showActionSheet({
        itemList: ["删除"]
      });
      this.handleDeleteReply(id);
    } catch (e) {
      this.logger.info("取消");
    }
  };

  handleReplyBubble = (id) => {
    this.logger.info("回复", id);
    this.setState({showInputModal: true});
  };

  handleDeleteBubble = async (id) => {
    this.logger.info("删除", id);
    Listen.showLoading("删除中...");
    apiHub.bubbleApi.deleteBubble(id)
      .then(() => {
        this.props.onUpdate(undefined);
        Listen.hideLoading();
      })
      .catch(e => {
        this.logger.error(e);
        Listen.hideLoading();
        Listen.message.error("删除失败，请重试");
      });
  };

  handleDeleteReply = async (id) => {
    this.logger.info("删除回复", id);
    Listen.showLoading("删除中...");
    apiHub.bubbleApi.deleteReply(id)
      .then(() => {
        Listen.hideLoading();
        const {bubble, onUpdate} = this.props;
        bubble.replyList = bubble.replyList.filter(r => id != r._id);
        // this.logger.info("删除后", bubble);
        this.logger.info("删除后", bubble);
        onUpdate(bubble);
      })
      .catch(e => {
        this.logger.error(e);
        Listen.hideLoading();
        Listen.message.error("删除失败");
      })
  };

  handleInputModalOk = async (text: string) => {
    this.logger.info("ok", text);
    this.handleInputModalHide();
    // 先放上去
    const {bubble, onUpdate} = this.props;
    const replyVO = {
      bubbleId: bubble._id,
      content: text,
      createTime: new Date().getTime()
    };
    // @ts-ignore
    bubble.replyList.push(replyVO);
    onUpdate(bubble);

    // 再后服务器发送
    try {
      // @ts-ignore
      replyVO._id = await apiHub.bubbleApi.sendReply({...replyVO});
      this.logger.info("发送回复成功", replyVO);
      onUpdate(bubble);
    } catch (e) {
      // 出错就要删除
      Listen.message.error("回复失败");
      bubble.replyList.pop();
      onUpdate(bubble);
    }
  };

  handleInputModalHide = () => {
    this.setState({
      showInputModal: false
    });
  };

  render(): any {
    const {bubble, hideAvatar} = this.props;
    const {showInputModal} = this.state;
    const {bubbleColor} = this.userConfig;

    this.logger.info("render bubble", bubble);

    // 构建右边的气泡
    // @ts-ignore
    const rightBubbleWrapper = (
      <View className={`right-flex bubble-item`}>
        {hideAvatar ? null :(<View className={"avatar-wrapper"}>
          <UserAvatar size={38} margin={0}/>
        </View>)}
        <RightBubble bubble={bubble} color={bubbleColor} onLongPress={this.handleLongPressRightBubble}/>
        <FullScreenEmojiFactory bubble={bubble}/>
      </View>
    );

    // 构建左边的气泡
    const leftBubblesWrapper =
      bubble.replyList.map((r, index) => (
          <View className={"left-flex bubble-item"} key={index}>
            {hideAvatar ? null :(<View className={"avatar-wrapper"}>
              <UserAvatar size={38} margin={0}/>
            </View>)}
            <LeftBubble bubble={r} onLongPress={this.handleLongPressLeftBubble} />
          </View>
        ));

    return (
      // 根据bubble.type给气泡加上不同的 类名 以实现不同的冒泡效果
      <View className={`${BubbleStyleConfig[bubble.style].className}`}>
        {rightBubbleWrapper}
        {leftBubblesWrapper}
        <InputModal
          visible={showInputModal}
          title={"写下批注吧"}
          onConfirm={this.handleInputModalOk}
          onHide={this.handleInputModalHide}/>
        {/*{showInputModal ?  : null}*/}
      </View>
    )
  }
}
