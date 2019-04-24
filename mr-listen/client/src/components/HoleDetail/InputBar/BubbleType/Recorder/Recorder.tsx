import Taro from "@tarojs/taro";
import {View, Image, Text} from "@tarojs/components";
import micPng from "../../../../../images/mic.png";
import micIngPng from "../../../../../images/mic-ing.png";
import Logger from "../../../../../utils/logger";
import "./Recorder.less";

interface IProp {
  onRecord: (fileId) => void,
  onHide: () => void
}

interface IState {
  recording: boolean,
  time: number,
  e: Taro.RecorderManager.onError.ParamParam | null
}

export default class Recorder extends Taro.Component<IProp, IState> {


  private logger = Logger.getLogger(Recorder.name);
  private recordManager = Taro.getRecorderManager();
  private timer = 0;

  constructor(props) {
    super(props);
    this.initRecordManager();
  }


  private initRecordManager() {
    this.recordManager.onStart(this.handleStartRecord);
    this.recordManager.onStop(this.handleStopRecord);
    this.recordManager.onError(this.handleErrorRecord)
  }

  // @ts-ignore
  state = {
    recording: false,
    time: 0
  };

  render(): any {
    // @ts-ignore
    const {recording, time, e} = this.state;
    return (
      <View className={"Recorder-cover"} onClick={this.handleClickCover}>
        <View className={"Recorder-main"} onClick={e => e.stopPropagation()}>
          <View className={"Recorder-item"}>
            {recording
              ? <Image className={"Recorder-icon recording"} src={micIngPng} onClick={this.handleClickStop}/>
              : <Image className={"Recorder-icon"} src={micPng} onClick={this.handleClickStart}/>}
          </View>
          <View className={"Recorder-item"}><Text className={"Recorder-tip"}>
            {e ? (`录音出错：${e.errMsg}`) : (recording ? "录音中" : "点击图标开始录音")}
          </Text></View>
          <View className={"Recorder-item"}><Text className={"Recorder-time"}>{time}s</Text></View>
        </View>
      </View>
    )
  }

  handleClickStart = (e) => {
    e.stopPropagation();
    this.setState({
      recording: true,
      e: null
    });
    this.recordManager.start({});
  };
  handleClickStop = (e) => {
    e.stopPropagation();
    this.setState({
      recording: false
    });
    this.recordManager.stop();
  };

  handleClickCover = (e) => {
    e.stopPropagation();
    this.logger.info("点击了cover");
    this.props.onHide();
  };

  handleStopRecord = (res: Taro.RecorderManager.onStop.ParamParam) => {
    const {tempFilePath} = res;
    this.stop();
    this.logger.info(tempFilePath);
    this.props.onRecord(tempFilePath);
  };

  handleStartRecord = () => {
    this.timer = setInterval(() => {
      const {time} = this.state;
      this.setState({time: time + 1});
    }, 1000);
  };

  handleErrorRecord = (e: Taro.RecorderManager.onError.ParamParam) => {
    this.logger.error(e);
    this.setState({e});
    this.stop();
  };

  private stop() {
    clearInterval(this.timer);
    this.setState({time: 0, recording: false});
  }
}
