import Taro from "@tarojs/taro";
import {Image, View} from "@tarojs/components";
import svgVoice from "../../../../images/voice.svg";
import "./BubbleType.less";
import {Bubble, BubbleStyle, BubbleType} from "../../../../apis/BubbleApi";
import Recorder from "./Recorder/Recorder";
import "@tarojs/async-await";

interface IProp {
  onSend: (bubble: Bubble) => void;
}

interface IState {
  showRecorder: boolean
}

export default class BubbleTypeVoice extends Taro.Component<IProp, IState> {

  state = {
    showRecorder: false
  };

  render() {
    const {showRecorder} = this.state;
    return (
      <View className={"BT-wrapper"} onClick={this.handleClick}>
        <Image src={svgVoice} className={"BT-image"}/>
        { showRecorder ? <Recorder onRecord={this.handleRecordSuccess} onHide={this.handleHideRecorder}/> : null }
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
      sendTime: Date.now(),
      style: BubbleStyle.NORMAL,
      type: BubbleType.VOICE
    }
  }

  handleClick = () => {
    this.setState({showRecorder: true});
  };

  handleRecordSuccess = async (path) => {
    const bubble = this.createBubble(path);
    this.props.onSend(bubble);
    this.handleHideRecorder();
  };

  handleHideRecorder = () => {
    this.setState({showRecorder: false});
  };
}
