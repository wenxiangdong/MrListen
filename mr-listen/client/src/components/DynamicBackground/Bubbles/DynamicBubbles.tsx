import "./DynamicBubbles.less";

import {Block, View} from "@tarojs/components";

import Taro from "@tarojs/taro";
import "@tarojs/async-await";

interface IProp {
}

interface IState {
  mounted: boolean
}

interface BubbleInfo {
  top: string,
  left: string,
  color: string,
  delay: string
}

export default class DynamicBubbles extends Taro.Component<IProp, IState> {
  constructor(props) {
    super(props);
    this.state = {mounted: false};
    this.generateBubbles();
  }

  private bubbleList: BubbleInfo[] = [];

  private generateBubbles() {
    for (let i = 0; i < 34; i++) {
      this.bubbleList.push({
        top: Math.round(Math.random() * 110) - 10 + 'vh',
        left: Math.round(Math.random() * 110) - 10 + 'vw',
        color: `color-${Math.round(Math.random() * 4) % 4}`,
        delay: `${(Math.round(Math.random() * 100)) / 100 * 4}s`
      })
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({mounted: true})
    })
  }

  render(): any {
    const {mounted} = this.state;

    const bubbles = this.bubbleList.map((bubbleInfo, index) => {
      return (
        <View className={'bubble-box'} style={{animationDelay: bubbleInfo.delay}}
              key={index}>
          <View className={`bubble ${bubbleInfo.color}`} style={{top: bubbleInfo.top, left: bubbleInfo.left, animationDelay: bubbleInfo.delay}}/>
        </View>
      )
    });

    return (
      <Block>
        <View className={"outside-shown-box"}>
          {mounted ? bubbles : ''}
        </View>
      </Block>
    )
  }
}
