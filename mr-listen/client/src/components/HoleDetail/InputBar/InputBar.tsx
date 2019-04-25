import "./InputBar.less";
import * as Taro from "@tarojs/taro";
import { Input, View, Block } from "@tarojs/components";
import { Component } from "@tarojs/taro";
import BubbleTypePicture from "./BubbleType/BubbleTypePicture";
import BubbleTypeVoice from "./BubbleType/BubbleTypeVoice";
import { Bubble } from "../../../apis/BubbleApi";

interface IProp {
  onBubbling: (bubble: Bubble) => void
}

interface IState {
  text: string,
  showTool: boolean
}

// export default class InputBar extends Component<IProp, IState> {
//   render(): any {
//     const {showTool} = this.state;
//     const {onBubbling} = this.props;
//     const toolsPanel = (
//       <View className={"IB-toolbar"}>
//         <View className={"IB-grid"}>
//           <BubbleTypePicture onSend={onBubbling}/>
//         </View>
//         <View className={"IB-grid"}>
//           <BubbleTypeVoice onSend={onBubbling}/>
// =======
//   // bottom: 0;
// }

export default class InputBar extends Component<IProp, IState> {

  static externalClasses = ['input-bar-class'];

  // private onFocus(e) {
  //   this.setState({
  //     bottom: e.detail.height
  //   })
  // }
  //
  // private onBlur() {
  //   this.setState({
  //     bottom: 0
  //   })
  // }

  render(): any {
    const { showTool } = this.state;
    const { onBubbling } = this.props;

    const toolsPanel = (
      <View className={"IB-toolbar"}>
        <View className={"IB-grid"}>
          <BubbleTypePicture onSend={onBubbling} />
        </View>
        <View className={"IB-grid"}>
          <BubbleTypeVoice onSend={onBubbling} />
        </View>
      </View>
    );

    return (
      // 乘以2应该是taro的锅
      // <View className={"IB-wrapper input-bar-class"} style={{bottom: 2 * this.state.bottom + 'rpx'}}>
      <Block>
        <View className={"IB-wrapper input-bar-class"}>
          <View className={"IB-style-btn IB-btn"}>
            H
        </View>
          {/*两种方案，第一种动画更自然（完全贴合键盘），但是会将内容上移，内容少时会出现错误，使用时应该把上面那个style注释掉*/}
          {/*第二种方案手动拟合动画曲线（当然只是拟合了ios，木有安卓），有点不自然，但是没有上面的错误*/}
          {/*cursor-spacing在手机点击输入框时推出键盘时使用，数值好像无所谓，我觉得安卓测试起来很可能会有问题，因为ios的机制貌似不太一样*/}
          {/*confirm-hold：点击发送后不收起*/}
          <Input className={"IB-input"} placeholder={""} confirmType={"send"} confirm-hold={true} cursor-spacing={'32rpx'} />
          {/*<Input className={"IB-input"}*/}
          {/*placeholder={""}*/}
          {/*confirmType={"send"}*/}
          {/*confirm-hold={true}*/}
          {/*adjustPosition={false}*/}
          {/*onFocus={this.onFocus}*/}
          {/*onBlur={this.onBlur}*/}
          {/*/>*/}
          <View className={"IB-add-btn IB-btn" + (showTool ? " close" : "")} onClick={this.handleClickShowTool}>
            +
        </View>
        </View>
        {showTool ? toolsPanel : null}
      </Block>
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