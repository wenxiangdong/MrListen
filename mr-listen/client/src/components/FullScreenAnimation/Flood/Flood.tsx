import "./Flood.less";

import {Block, View} from "@tarojs/components";
import UserConfig from "./../../../utils/user-config";


import Taro from "@tarojs/taro";
import "@tarojs/async-await";

interface IFloodElement {
  x: string,
  y: string,
  delay: string,
  content: string
}

export default class Flood extends Taro.Component<any, any> {

  private floodElements: IFloodElement[] = [];
  private readonly bubbleColor;

  constructor(props) {
    super(props);
    this.initFlood();
    this.bubbleColor = UserConfig.getConfig().themeColor;
  }

  private initFlood() {
    for (let i = 0; i < 50; i++) {
      this.floodElements.push({
        x: Math.random() * 550 - 150 + 'px',
        y: Math.random() * 400 - 100 + 'px',
        delay: Math.random() * 3000 + 'ms',
        content: ''});
    }
  }

  render(): any {

    const FloodBubbles = this.floodElements.map((element, index) =>
      <View className={'bubble'}
            key={index}
            style={{
              left: element.x,
              bottom: element.y,
              animationDelay: element.delay,
              backgroundColor: this.bubbleColor
            }}>
        {element.content}
      </View>
    );

    return (
      <Block>
        <View className={"outside-shown-box"}>
          <View className={'main-box'}>
            <View className={"bubbles-box"}>
              <View className={'relative-box'}>
                {FloodBubbles}
              </View>
            </View>
          </View>
        </View>
      </Block>
    )
  }
}
