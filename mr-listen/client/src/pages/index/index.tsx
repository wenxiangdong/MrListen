import Taro, {Component, Config} from '@tarojs/taro'
import {Block, Image, ScrollView, Text, View} from '@tarojs/components'
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
import sharePng from "../../images/share.png";
import WhiteSpace from "../../components/common/WhiteSpace/WhiteSpace";
import DynamicBackgroundFactory from "../../components/DynamicBackground/DynamicBackgroundFactory";
import userConfig from "../../utils/user-config";
import ShakeIt from "../../components/ShakeIt/ShakeIt";
import keyboardBehaviorPublisher, {KeyboardBehaviorTypes} from "../../utils/keyboard-behavior-publisher";
import HelpSwiper from "../../components/personal/help/HelpSwiper";
import LoadingCover from "../../components/common/LoadingCover/LoadingCover";
import shakePublisher from "../../utils/shake-publisher";

interface IState {
  bubbleVOList: BubbleVO[],
  holeId: number | string,
  title: string,
  pageHeight: string, // scroll view的高度，通过键盘高度计算
  top: string,  //  scroll view 整个页面最上方的高度
  lastBubbleId: string,  // 最后一个气泡的dom id 用于scroll view滚过去
  mounted: boolean // 动画效果的bug，确认页面加载完了之后延迟一会再设置动画可以规避这个bug
  shakeItOn: boolean, // 是否开启了 摇一摇
  loadingBubbles: boolean
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
    navigationBarTitleText: '即刻倾诉',
    // enablePullDownRefresh: true,
    disableScroll: true
  };


  constructor(props) {
    super(props);
    // systemInfo.

    this.state = {
      bubbleVOList: [] as BubbleVO[],
      holeId: "",
      title: "新倾诉",
      pageHeight: "100vh",
      lastBubbleId: "",
      top: "0",
      mounted: false,
      shakeItOn: true,
      loadingBubbles: false
    };

    // 订阅键盘行为事件
    keyboardBehaviorPublisher.subscribe(KeyboardBehaviorTypes.POP, this.handleFocus);
    keyboardBehaviorPublisher.subscribe(KeyboardBehaviorTypes.HIDE, this.handleBlur);

    // can i use
    this.loadCanIUse();
  }


  private logger = Logger.getLogger(Index.name);

  private SENDING_BUBBLE = "sending";
  private BUBBLE_ANIMATION_DURATION = 1000;

  private resolveBubbleWithTempFile = async (bubble: Bubble) => {
    const url = await apiHub.fileApi.uploadFile(
      // 路径最后增加随机数，防止重复
      `bubbles/${bubble.type}/${Date.now()}-${Math.random()}`,
      bubble.content
    );
    bubble = {...bubble, content: url} as Bubble;
    this.logger.info("处理完的bubble", bubble);
    return bubble;
  };

  // 根据类型处理raw气泡的
  private resolveRawBubble = {
    [BubbleType.PICTURE]: this.resolveBubbleWithTempFile,
    [BubbleType.VOICE]: this.resolveBubbleWithTempFile,
    [BubbleType.TEXT]: async (bubble) => bubble
  };

  private iconToAction = {
    [mePng.toString()]: () => {
      let url = "/pages/personal/center";
      Taro.navigateTo({
        url
      }).catch(() => {
        this.logger.error(`跳转到${url}失败`);
        Listen.message.error("跳转失败");
      });
    },
    [clockPng.toString()]: () => {
      let url = "/pages/holes/holes";
      Taro.navigateTo({
        url
      }).catch(() => {
        this.logger.error(`跳转到${url}失败`);
        Listen.message.error("跳转失败");
      });
    },
    // [sharePng.toString()]: () => {
    //   const {holeId} = this.state;
    //   let url = `/pages/share/index${holeId ? ("?holeId=" + holeId) : ""}`;
    //   this.logger.info("url", url);
    //   Taro.navigateTo({
    //     url
    //   }).catch(() => {
    //     this.logger.error(`跳转到${url}失败`);
    //     Listen.message.error("跳转失败");
    //   });
    // }
  };


  render() {

    const {bubbleVOList, title, pageHeight, lastBubbleId, shakeItOn, mounted, loadingBubbles} = this.state;

    // 构建所有气泡
    let bubbleVOListLength = bubbleVOList.length;
    const bubbles = bubbleVOList
      .filter(b => !!b)
      .map((b, index) =>
        b
        ? (
          // @ts-ignore
          <ChatBubble
            chat-bubble-class={index === bubbleVOListLength - 1 ? "chat-bubble" : ""}
            id={"bubble" + index}
            key={`chat-bubble-${index}`}
            bubble={b}
            onUpdate={(bubble) => this.handleUpdateBubble(bubble, index)}
          />)
          : null
      );

    let icons = Object.keys(this.iconToAction);
    const iconComponents = icons.map((icon, idx) => (
        <Block key={`icon-block-${idx}`}>
          <View className={'click-area'} onClick={() => this.handleClickIcon(icon.toString())}>
            <Image src={icon} className={"index-icon"}/>
          </View>
          {idx === icons.length - 1 ? null : <View className={"index-divider"}/>}
        </Block>
      ));


    return (
      <Block>
        <ScrollView scrollY className={'main-box'} style={{height: pageHeight}} scrollIntoView={lastBubbleId}>
          <WhiteSpace height={60}/>
          <View className={"index-nav-bar"}>
            <View className={"index-avatar-wrapper"}>
              {/*<View>*/}
              <Text className={"index-title"}>
                {title}
              </Text>
              {/*</View>*/}
            </View>
            <View className={"index-icon-group"}>
              {/*<View className={'click-area'} onClick={() => this.handleClickIcon(clockPng.toString())}>*/}
                {/*<Image src={clockPng} className={"index-icon"}/>*/}
              {/*</View>*/}
              {/*<View className={"index-divider"}/>*/}
              {/*<View className={'click-area'} onClick={() => this.handleClickIcon(mePng.toString())}>*/}
                {/*<Image src={mePng} className={"index-icon"}/>*/}
              {/*</View>*/}
              {/*<View className={"index-divider"}/>*/}
              {/*<View className={'click-area'} onClick={() => this.handleClickIcon(sharePng.toString())}>*/}
                {/*<Image src={sharePng} className={"index-icon"}/>*/}
              {/*</View>*/}
              {iconComponents}
            </View>
          </View>
          {/*<View className={"bubble-area"}>*/}
          {bubbles}
          {/*</View>*/}
          <WhiteSpace height={50}/>
          <InputBar
            onBubbling={this.handleBubbling}
            input-bar-class={'input-bar'}/>
        </ScrollView>
        {/*一些其他东西*/}
        {mounted ? <DynamicBackgroundFactory/> : null}
        {shakeItOn ? <ShakeIt onShake={this.handleShake}/> : null}
        <HelpSwiper checkFirstUse={true}/>
        {loadingBubbles ? <LoadingCover height={"100vh"} tip={"加载气泡中"} backgroundColor={"white"}/> : null}
      </Block>
    );
  }

  // 输入框聚集，键盘弹起
  handleFocus = (keyboardHeight) => {
    this.logger.info(keyboardHeight);
    const pageHeight = `calc(100vh - ${keyboardHeight}px)`;  // (ios减5之后会有问题) 再减5px是为了让气泡不要太贴近输入框
    this.setState({
      pageHeight,
      top: `${keyboardHeight}px`
    }, () => {
      // 键盘弹起 滑到底部
      console.log('键盘弹起，触发滚动键盘高度效果');
      this.scrollToBottom();
    });
  };

  handleBlur = () => {
    this.logger.info("blur");
    this.setState({
      pageHeight: "100vh",
      top: "0"
    });
  };

  // 点击上方菜单图标
  handleClickIcon = (img: string) => {
    const action = this.iconToAction[img];
    if (typeof action === "function") {
      action();
    }
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
      createTime: Date.now(),
      replyList: []
    };
    // @ts-ignore
    this.setState((pre) => ({
      bubbleVOList: [...pre.bubbleVOList, bubbleVO],
      holeId,
      lastBubbleId: `bubble${pre.bubbleVOList.length}`,
      lastBubble: {...bubble}
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

  handleShake = () => {
    (this.state.holeId) &&
    apiHub.holeApi.deleteHole(this.state.holeId)
      .then(() => {
        this.setState({
          holeId: "",
          bubbleVOList: [],
          lastBubbleId: "",
          title: "新倾诉"
        });
      })
      .catch(this.logger.error);
  };

  componentDidMount(): void {

    this.logger.info(this.$router.params);
    const params = this.$router.params;
    const holeId = params.holeId;
    if (holeId) {
      this.logger.info("啊，跳转过来的啦", holeId);
      // 存在这个参数的话，证明是从树洞列表跳转过来的，需要拿所有的气泡
      const title = params.title;
      this.setState({holeId, title});
      // TODO 从api拿气泡
      this.getBubbles(holeId);
    }
    setTimeout(() => {
      this.setState({mounted: true})
    }, 200)
  }


  componentDidShow(): void {
    this.logger.info("show");
    // 要在每次show的时候检查一下是不是开启了相关的个人设置，如 摇一摇
    this.checkShakeIt();
    shakePublisher.begin();
  }


  componentDidUpdate(): void {
    if (this.state.holeId) {
      // this.onShareAppMessage = this.handleShareAppMessage;
      Taro.showShareMenu();
    } else {
      Taro.hideShareMenu();
    }
  }

  componentDidHide(): void {
    shakePublisher.stop();
  }

  onPullDownRefresh(): void {
    const {holeId, bubbleVOList} = this.state;
    if (holeId && (!bubbleVOList || !bubbleVOList.length)) {
      this.getBubbles(holeId);
    }
  }

  getBubbles(holeId) {
    this.setState({
      loadingBubbles: true
    }, () => {
      this.getBubbleAsync(holeId, this.scrollToBottom)
        .catch((e) => {
          Listen.message.error("请重新进入");
          this.logger.error(e);
          this.setState({
            loadingBubbles: false
          });
        })
    });
  }

  async getBubbleAsync(holeId, callback) {
    let res = (await apiHub.holeApi.getBubblesFromHole(holeId))
      .map(item => ({...item, noAnimation: true}));

    this.setState({
      bubbleVOList: res
    }, () => {
      callback();
      // 气泡放完成后，设置一个定时，等动画放完再显示
      setTimeout(() => {
        this.setState({
          loadingBubbles: false,
          lastBubbleId: this.getDefaultLatBubbleId()
        });
      }, this.BUBBLE_ANIMATION_DURATION);
    });
  }

  scrollToBottom = () => {
    setTimeout(() => {
      this.setState({
        lastBubbleId: ''
      }, () => {
        this.setState({
          lastBubbleId: this.getDefaultLatBubbleId()
        })
      });
    }, 0);
  };

  getDefaultLatBubbleId = () => {
    let {bubbleVOList = []} = this.state;
    return `bubble${bubbleVOList.length - 1}`;
  };

  // async onShareAppMessage(obj: Taro.ShareAppMessageObject): Taro.ShareAppMessageReturn {
  //   try {
  //     const shareKey = await apiHub.shareHoleApi.createShareHole(this.state.holeId, -1);
  //     return {
  //       title: "倾诉分享",
  //       path: `/pages/share/hole/hole?holeId=${shareKey}`
  //     }
  //   } catch (e) {
  //     this.logger.info(e);
  //   }
  // }


  checkShakeIt() {
    let config = userConfig.getConfig();
    this.setState({
      shakeItOn: !!config.shakeOff
    });
  }


  loadCanIUse() {
    const SHARE_KEY = "share";
    apiHub.userApi.canIUse(SHARE_KEY)
      .then(res => {
        if (res) {
          this.iconToAction[sharePng.toString()] = () => {
            const {holeId} = this.state;
            let url = `/pages/share/index${holeId ? ("?holeId=" + holeId) : ""}`;
            // this.logger.info("url", url);
            Taro.navigateTo({
              url
            }).catch(() => {
              this.logger.error(`跳转到${url}失败`);
              Listen.message.error("跳转失败");
            });
          };
          try {
            this.forceUpdate();
          } catch (e) {}
        } else {
          this.logger.info("不能使用" + SHARE_KEY);
        }
      }).catch(e => {
        this.logger.error(e);
    })
  }

}


export default Index;
