import "./InputBar.less";
import * as Taro from "@tarojs/taro";
import {Input, View} from "@tarojs/components";
import {Component} from "@tarojs/taro";
import BubbleTypePicture from "./BubbleType/BubbleTypePicture";
import BubbleTypeVoice from "./BubbleType/BubbleTypeVoice";
import {Bubble} from "../../../apis/BubbleApi";

interface IProp {
  onBubbling: (bubble: Bubble) => void
}

interface IState {
  text: string,
  showTool: boolean
}

export default class InputBar extends Component<IProp, IState> {
  render(): any {
    const {showTool} = this.state;
    const {onBubbling} = this.props;
    const toolsPanel = (
      <View className={"IB-toolbar"}>
        <View className={"IB-grid"}>
          <BubbleTypePicture onSend={onBubbling}/>
        </View>
        <View className={"IB-grid"}>
          <BubbleTypeVoice onSend={onBubbling}/>
        </View>
      </View>
    );
    return (
      <View className={"IB-out"}>
        <View className={"IB-wrapper"}>
          <View className={"IB-style-btn IB-btn"}>
            H
          </View>
          <Input className={"IB-input"} placeholder={"回车发送"} confirmType={"send"}/>
          <View className={"IB-add-btn IB-btn" + (showTool ? " close" : "")} onClick={this.handleClickShowTool}>
            {/*{showTool ? "-" : "+"}*/}
            +
          </View>
        </View>
        {showTool ? toolsPanel : null}
      </View>
    );
  }

  handleClickShowTool = () => {
    this.setState((pre) => {
      this.setState({
        showTool: !pre.showTool
      })
    });
  }
}
