import Taro, {Component, Config} from '@tarojs/taro'
import {Block, View, Text, Image} from '@tarojs/components'
import './index.less'
import {Bubble, BubbleType, BubbleVO} from "../../apis/BubbleApi";
import Logger from "../../utils/logger";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import InputBar from "../../components/HoleDetail/InputBar/InputBar";
import {apiHub} from "../../apis/ApiHub";
import "@tarojs/async-await";
import Listen from "../../utils/listen";

import clockPng from "../../images/clock.png";
import mePng from "../../images/me.png";

interface IState {
  bubbleVOList: BubbleVO[],
  holeId: number | string
}

class Index extends Component<any, IState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '即刻倾诉'
  };

  state = {
    bubbleVOList: [] as BubbleVO[],
    holeId: "",
    title: "新会话"
  };

  private logger = Logger.getLogger(Index.name);

  private SENDING_BUBBLE = "sending";

  private resolveBubbleWithTempFile = async (bubble: Bubble) => {
    const url = await apiHub.fileApi.uploadFile(
      `bubbles/${bubble.type}/${new Date().getTime()}`,
      bubble.content
    );
    return {...bubble, content: url} as Bubble;
  };

  // 根据类型处理raw气泡的
  private resolveRawBubble = {
    [BubbleType.PICTURE]: this.resolveBubbleWithTempFile,
    [BubbleType.VOICE]: this.resolveBubbleWithTempFile,
    [BubbleType.TEXT]: async (bubble) => bubble
  };


  private iconToLink = {
    [mePng.toString()]: "me",
    [clockPng.toString()]: "history"
  };

  render() {

    const {bubbleVOList, title} = this.state;

    // 构建所有气泡
    const bubbles = bubbleVOList
      .filter(b => !!b)
      .map((b, index) =>
        <ChatBubble
          key={index}
          bubble={b}
          onUpdate={(bubble) => this.handleUpdateBubble(bubble, index)}
        />);

    return (
      <Block>
        <View className={'main-box'}>
          <View className={"index-nav-bar"}>
            <View className={"index-avatar-wrapper"}>
              {/*<View>*/}
              <Text className={"index-title"}>
                {title}
              </Text>
              {/*</View>*/}
            </View>
            <View className={"index-icon-group"}>
              <Image src={clockPng} className={"index-icon"} onClick={() => this.handleClickIcon(clockPng.toString())}/>
              <View className={"index-divider"}/>
              <Image src={mePng} className={"index-icon"} onClick={() => this.handleClickIcon(mePng.toString())}/>
            </View>
          </View>
          <View className={"bubble-area"}>
            {bubbles}
          </View>
          <InputBar onBubbling={this.handleBubbling} input-bar-class={'input-bar'}/>
        </View>
      </Block>
    );
  }

  handleClickIcon = (img) => {
    const url = this.iconToLink[img];
    Taro.navigateTo({
      url
    }).catch(() => {
      this.logger.error(`跳转到${url}失败`);
      Listen.message.error("跳转失败");
    });
  };

  handleBubbling = async (bubble: Bubble) => {
    this.logger.info("接收到的bubble", bubble);

    // 是否为新建的
    let {holeId} = this.state;
    if (!holeId) {
      try {
        Listen.showLoading("创建新记录中...");
        // @ts-ignore
        holeId = await apiHub.holeApi.createHole();
        this.logger.info(holeId);
        Listen.hideLoading();
      } catch (e) {
        Listen.hideLoading();
        Listen.message.error("创建失败");
        this.logger.error(e);
        return;
      }
    }

    // 构建气泡并先展示上去
    const bubbleVO = {
      _id: this.SENDING_BUBBLE,
      holeId: holeId,
      type: bubble.type,
      style: bubble.style,
      content: bubble.content,
      createTime: new Date().getTime(),
      replyList: []
    };
    // @ts-ignore
    this.setState((pre) => ({
      bubbleVOList: [...pre.bubbleVOList, bubbleVO],
      holeId
    }));

    // 发送气泡
    try {
      bubble.holeId = holeId;
      this.logger.info("开始发送");
      const resolveFunc = this.resolveRawBubble[bubble.type];
      if (typeof resolveFunc === "function") {
        bubble = await resolveFunc(bubble);
      }
      const id = await apiHub.bubbleApi.sendBubble(bubble);
      // @ts-ignore
      bubbleVO._id = id;
      this.logger.info("发送成功", id);
      this.forceUpdate();
    } catch (e) {
      // 发送错误了，就要把气泡弃置
      const {bubbleVOList} = this.state;
      bubbleVOList.pop();
      this.setState({bubbleVOList});
      this.logger.error(e);
      Listen.message.error("发送失败");
    }
  };

  handleUpdateBubble = (bubble, index) => {
    this.logger.info("更新", bubble, index);
    const {bubbleVOList} = this.state;
    if (bubble) {
      bubbleVOList[index] = bubble;
    } else {
      bubbleVOList.splice(index, 1);
    }
    this.logger.info("更新", bubbleVOList);
    this.setState({
      bubbleVOList
    });

  };

  componentDidMount(): void {
    this.logger.info(this.$router.params);
    const params = this.$router.params;
    const holeId = params.holeId;
    if (holeId) {
      this.logger.info("啊，跳转过来的啦", holeId);
      // 存在这个参数的话，证明是从树洞列表跳转过来的，需要拿所有的气泡
      this.setState({holeId});
      // TODO 从api拿气泡
    }
  }

}


export default Index;
