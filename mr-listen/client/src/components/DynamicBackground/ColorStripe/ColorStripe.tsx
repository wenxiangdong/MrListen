import "./ColorStripe.less";
import "./Rainbow.less"
import "./Candy.less"

import {Block, View} from "@tarojs/components";

import Taro from "@tarojs/taro";
import "@tarojs/async-await";

interface IProp {
  colorSet: string
}

export default class ColorStripe extends Taro.Component<IProp, any> {
  constructor(props) {
    super(props);
  }


  render(): any {

    const {colorSet} = this.props;

    return (
      <Block>
        <View className={"outside-shown-box"}>
          <View className={'main-box'}>
            <View className={'music-box'}>
              <View className={`column color-1 ${colorSet}-1`}/>
              <View className={`column color-2 ${colorSet}-2`}/>
              <View className={`column color-3 ${colorSet}-3`}/>
              <View className={`column color-4 ${colorSet}-4`}/>
              <View className={`column color-5 ${colorSet}-5`}/>
              <View className={`column color-6 ${colorSet}-6`}/>
            </View>
          </View>
        </View>
      </Block>
    )
  }
}
