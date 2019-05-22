import "./Playback.less";
import Taro from "@tarojs/taro";
import {View, Image, ScrollView} from "@tarojs/components";
import {BubbleVO} from "../../apis/BubbleApi";
import ChatBubble from "../ChatBubble/ChatBubble";
import Logger from "../../utils/logger";
import playPng from "../../images/play.png";
import pausePng from "../../images/pause.png";
import forwardPng from "../../images/FastForward.png";
import replayPng from "../../images/replay.png";
import Listen from "../../utils/listen";

interface IProp {
  bubbles: BubbleVO[],
  renderFooterLeft?: JSX.Element | null
  renderFooterRight?: JSX.Element | null
}

interface IState {
  bubbleVOList: BubbleVO[],
  playingBubbleList: BubbleVO[], // 在屏幕上显示的
  playing: boolean,
  lastViewId: string
}

export default class Playback extends Taro.Component<IProp, IState> {

  state = {
    bubbleVOList: [],
    playingBubbleList: [],
    playing: true,
    lastViewId: ""
  };

  private DURATION = 1500;
  private logger = Logger.getLogger(Playback.name);

  shouldComponentUpdate(nextProps: Readonly<IProp>, nextState) {
    if (this.props.bubbles !== nextProps.bubbles) {
      // @ts-ignore
      nextState.bubbleVOList = [...nextProps.bubbles];
      setTimeout(() => {
        this.playbackBubbles();
      }, 300);
    }
    return true;
  }

  playbackBubbles() {
    const {bubbleVOList, playing} = this.state;
    if (!bubbleVOList.length) {
      return;
    }

    if (!playing) {
      return;
    }
    // @ts-ignore
    this.setState(pre => ({
      playingBubbleList: [...pre.playingBubbleList, pre.bubbleVOList.shift()],
      lastViewId: this.createBubbleId(pre.playingBubbleList.length)
    }), () => {
      setTimeout(() =>
          this.playbackBubbles(),
        this.DURATION
      )
    });
  }

  handleClickPlayOrPause = () => {
    this.setState(pre => ({
      playing: !pre.playing
    }), () => {
      if (this.state.playing) {
        this.playbackBubbles();
      }
    });
  };

  handleChangeRate = (delt: number) => {
    const duration = this.DURATION + delt;
    this.logger.info(`速率变化了${delt}，可能变为${duration}`);
    const upper = 3500;
    const lower = 500;
    if (duration > upper) {
      Listen.message.info("已到达最慢速率");
    } else if (duration < lower) {
      Listen.message.info("已到达最快速率");
    } else {
      this.DURATION = duration;
    }
  };

  handleClickReplay = () => {
    this.setState(pre => ({
      bubbleVOList: [...pre.playingBubbleList],
      playingBubbleList: []
    }), () => {
      this.playbackBubbles();
    });
  };

  createBubbleId = (index: number) => {
    return "bubble" + index.toString();
  }


  render() {
    const {playingBubbleList, playing, bubbleVOList, lastViewId} = this.state;
    const {bubbles} = this.props;
    this.logger.info(this.props);
    if (!bubbles || !bubbles.length) {
      return null;
    }
    this.logger.info("render", this.state);

    const bubbleItems = playingBubbleList.map((b, index) => (
      // @ts-ignore
      <ChatBubble key={index} id={this.createBubbleId(index)} bubble={b} hideAvatar={true}/>
    ));
    const controlBar = (
      <View className={"Playback-control-wrapper"}>
        {this.props.renderFooterLeft}
        <View className={"Playback-control"} hoverClass={"Playback-control-hover"}
              onClick={() => this.handleChangeRate(200)}>
          <Image
            src={forwardPng}
            className={"Playback-backward Playback-second-control"}
          />
        </View>

        {bubbleVOList.length
          ? (<View className={"Playback-control"} hoverClass={"Playback-control-hover"}
                   onClick={this.handleClickPlayOrPause}>
            <Image src={playing ? pausePng : playPng} className={"Playback-main-control"}/>
          </View>)
          : (
            <View className={"Playback-control"} hoverClass={"Playback-control-hover"} onClick={this.handleClickReplay}>
              <Image src={replayPng} className={"Playback-main-control"}/>
            </View>)}

        <View className={"Playback-control"} hoverClass={"Playback-control-hover"}
              onClick={() => this.handleChangeRate(-200)}>
          <Image src={forwardPng} className={"Playback-forward Playback-second-control"}/>
        </View>

        {this.props.renderFooterRight}
      </View>
    );

    return (
      <View className={"Playback-cover"}>
        <View className={"Playback-main"}>
          <ScrollView scrollY={true} className={"Playback-scroller-view"} scrollIntoView={lastViewId}>
            {bubbleItems}
            {/* <WhiteSpace height={100}/> */}
          </ScrollView>
          {controlBar}
        </View>
        <View className={"Playback-footer"}>
        </View>
        {/* <Image src={homePng} className={"Playback-home-icon"} onClick={this.handleClickHome} /> */}
      </View>
    );
  }
}
