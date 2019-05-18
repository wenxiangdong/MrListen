import Taro, {Component} from "@tarojs/taro";
import {View, Image, Text} from "@tarojs/components";
import audioPng from "../../../images/audio.png";
import "./AudioContent.less";
import Logger from "../../../utils/logger";

interface  IProp {
  content: string
}

interface IState {
  playing: boolean,
  time: number
}

export default class AudioContent extends Component<IProp, IState> {

  state = {
    playing: false,
    time: 0
  };

  private audioContext: Taro.InnerAudioContext;
  private logger = Logger.getLogger(AudioContent.name);

  render() {
    const {playing, time} = this.state;
    return (
      <View className={"AC-bubble-audio"} onClick={this.handleClickAudio}>
        <Image src={audioPng} className={"AC-audio-icon" + (playing ? " AC-audio-icon-play" : "")}/>
        {playing ? <Text className={"Right-text bubble-text"}>{time.toFixed(0)}'</Text> : null}
        </View>
    );
  }

  handleClickAudio = (e) => {
    e.stopPropagation();
    const {playing} = this.state;
    if (!playing) {
      this.logger.info("play");
      this.audioContext = Taro.createInnerAudioContext();
      this.audioContext.autoplay = true;
      this.audioContext.src = this.props.content;
      // this.audioContext.play();
      this.setState({
        playing: true
      });
      this.audioContext.onTimeUpdate(() => {
        this.setState({
          time: this.audioContext.currentTime
        });
      });
      this.audioContext.onPlay(() => {
        this.logger.info("begin playing");
      });
      this.audioContext.onEnded(() => {
        this.logger.info("结束");
        this.setState({
          playing: false
        });
      });
      // @ts-ignore
      this.audioContext.onError((res) => {
        this.logger.error("出错", res);
        this.setState({
          playing: false
        });
      });
    } else {
      this.logger.info("stop");
      this.audioContext.stop();
      this.audioContext.destroy();
      this.setState({
        playing: false,
        time: 0
      });
    }
  }
}
