// Hole的详细组件，包括了输入框和气泡
// 可以参考pages/dev下面的两个文件
import "./HoleDetail.less";
import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from "@tarojs/components";
import InputBar from './InputBar/InputBar';
import {Bubble} from '../../apis/BubbleApi';
import Logger from '../../utils/logger';
import {BubbleVO} from "src/apis/BubbleApi";
import ChatBubble from "../ChatBubble/ChatBubble";


interface IProp {
  holeId: number | string
}

interface IState {
  bubbleVOList: BubbleVO[]
}

export default class HoleDetail extends Component<IProp, IState> {

  private logger = Logger.getLogger(HoleDetail.name);

  state = {
    bubbleVOList: [] as BubbleVO[]
  };


  render() {

    const {bubbleVOList} = this.state;
    this.logger.info("render", bubbleVOList);

    const bubbles = bubbleVOList
      .filter(b => !!b)
      .map((b, index) =>
        <ChatBubble
          key={index}
          bubble={b}
          onUpdate={(bubble) => this.handleUpdateBubble(bubble, index)}
        />);

    return (
      <View className={'main-box'}>
        <ScrollView scrollY onScrollToUpper={this.handleScrollToUpper}>
          {bubbles}
        </ScrollView>
        <InputBar onBubbling={this.handleBubbling} input-bar-class={'input-bar'}/>
      </View>
    );
  }

  handleScrollToUpper = () => {
    this.logger.info("到达顶部");
  };

  handleBubbling = (bubble: Bubble) => {
    this.logger.info("接收到的bubble", bubble);
    // @ts-ignore
    bubble = {
      holeId: bubble.holeId,
      content: bubble.content,
      sendTime: new Date().getTime(),
      _id: "",
      type: bubble.type,
      style: bubble.style,
      replyList: []
    } as BubbleVO;
    this.logger.info(bubble);
    // @ts-ignore
    this.setState((preState) => (
      {
        bubbleVOList: [...preState.bubbleVOList, bubble]
      }
    ));
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

}
