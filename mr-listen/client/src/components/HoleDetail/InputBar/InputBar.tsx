import "./InputBar.less";
import Taro, {Component} from "@tarojs/taro";
import {Block, Input, View} from "@tarojs/components";
import BubbleTypePicture from "./BubbleType/BubbleTypePicture";
import BubbleTypeVoice from "./BubbleType/BubbleTypeVoice";
import {Bubble, BubbleStyle, BubbleType} from "../../../apis/BubbleApi";
import Logger from "../../../utils/logger";
import Listen from "../../../utils/listen";

interface IProp {
  onBubbling: (bubble: Bubble) => void,
  onFocus: (height: number) => void,  // 输入框聚焦时，即键盘弹出时的回调，参数为键盘高度
  onBlur: () => void,
}

interface IState {
  text: string,
  showTool: boolean,
  keyboardHeight: number,
  bubbleStyle: BubbleStyle
}

export default class InputBar extends Component<IProp, IState> {

  static externalClasses = ['input-bar-class'];

  private logger = Logger.getLogger(InputBar.name);

  // 气泡风格菜单项
  private bubbleStyleMenus = {
    [BubbleStyle.NORMAL]: {
      icon: "N",
      label: "N（正常）"
    },
    [BubbleStyle.ANGRY]: {
      icon: "A",
      label: "A（不平）"
    },
    [BubbleStyle.HAPPY]: {
      icon: "H",
      label: "H（开心）"
    }
  };

  constructor(props) {
    super(props);
    this.handleConfirmInput = this.throttle(this.handleConfirmInput, this.handleInputTooFast);
    this.state = {
      text: "",
      showTool: false,
      keyboardHeight: 0,
      bubbleStyle: BubbleStyle.NORMAL
    }
  }


  render(): any {
    const {showTool, bubbleStyle} = this.state;

    const toolsPanel = (
      <View className={"IB-toolbar"}>
        <View className={"IB-grid"}>
          <BubbleTypePicture onSend={this.handleSpecialBubbling}/>
        </View>
        <View className={"IB-grid"}>
          <BubbleTypeVoice onSend={this.handleSpecialBubbling}/>
        </View>
      </View>
    );

    return (
      // 乘以2应该是taro的锅
      // <View className={"IB-wrapper input-bar-class"} style={{bottom: 2 * this.state.bottom + 'rpx'}}>
      <Block>
        <View className={"input-bar-class"}>
          <View className={"IB-wrapper"}>
            <View className={"IB-style-btn IB-btn"} onClick={this.handleClickStyleButton}>
              {/*H*/}
              {this.bubbleStyleMenus[bubbleStyle].icon}
            </View>
            <Input
              value={this.state.text}
              className={"IB-input"}
              placeholder={""}
              confirmType={"send"}
              confirm-hold={true}
              // cursor-spacing={'32rpx'}
              onInput={this.handleInput}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
              adjustPosition={false}
              onConfirm={this.handleConfirmInput}/>
            <View className={"IB-add-btn IB-btn" + (showTool ? " close" : "")} onClick={this.handleClickShowTool}>
              +
            </View>
          </View>
          {showTool ? toolsPanel : null}
          <View className={'keyboard-stub'} style={{height: this.state.keyboardHeight + 'px'}}/>
        </View>
      </Block>
    );
  }

  handleClickShowTool = () => {
    this.setState((pre) => {
      this.setState({
        showTool: !pre.showTool
      })
    });
  };

  // 点输入框左侧的风格按钮
  handleClickStyleButton = () => {
    const keys = Object.keys(this.bubbleStyleMenus);
    const itemList = keys.map(key => this.bubbleStyleMenus[key].label);
    Taro.showActionSheet({
      itemList
    }).then(({tapIndex}) => {
      const bubbleStyle = tapIndex;
      this.logger.info("select", bubbleStyle);
      this.setState({
        bubbleStyle: tapIndex
      })
    }).catch((e) => {
      this.logger.info("选择", e);
    })
  };

  handleInput = (e) => {
    this.setState({
      text: e.detail.value
    })
  };

  handleInputBlur = () => {
    const {onBlur} = this.props;
    if (typeof onBlur === "function") {
      onBlur();
    }
    this.setState({
      keyboardHeight: 0
    });
  };

  handleInputFocus = (e) => {
    this.logger.info(e);
    const {onFocus} = this.props;
    if (typeof onFocus === "function") {
      onFocus(e.detail.height);
    }
    this.setState({
      keyboardHeight: e.detail.height
    });
  };

  handleConfirmInput = (e) => {
    this.logger.info(e);
    // 去掉前后空格
    const value: string = e.detail.value.trim();
    // 判消息内容是否为空
    if (value) {
      const bubble = {
        type: BubbleType.TEXT,
        style: this.state.bubbleStyle,
        content: value,
      } as Bubble;
      this.props.onBubbling(bubble);
    }
    this.setState({
      text: ""
    })
  };

  handleInputTooFast = () => {
    Listen.message.info("你说得太快啦");
  };

  // 图片或语音气泡的冒泡
  handleSpecialBubbling = (bubble: Bubble) => {
    // 为其设置风格
    bubble.style = this.state.bubbleStyle;
    if (typeof this.props.onBubbling === "function") {
      this.props.onBubbling(bubble);
    }
  };


  // 节流，让消息只能间隔一秒发出
  throttle(method: Function, onError) {
    const duration = 200;
    var pre = 0;
    return function () {
      let now = +new Date();
      if (now - pre > duration) {
        method(...arguments);
        pre = now;
      } else {
        onError();
      }
    }
  }
}
