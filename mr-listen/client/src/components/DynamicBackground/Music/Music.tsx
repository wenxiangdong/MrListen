import "./Music.less";

import {Block, View} from "@tarojs/components";

import Taro from "@tarojs/taro";
import "@tarojs/async-await";

/**
 * @deprecated 有显示问题 直接废弃
 */
export default class Music extends Taro.Component<any, any> {
  constructor(props) {
    super(props);
  }


  render(): any {

    return (
      <Block>
        <View className={"outside-shown-box"}>
          <View className={'music-box'}>
            <View className={'column column-blue'} style={{animationDelay: '-800ms'}}/>
            <View className={'column column-green'} style={{animationDelay: '-600ms'}}/>
            <View className={'column column-lime'} style={{animationDelay: '-400ms'}}/>
            <View className={'column column-red'} style={{animationDelay: '-200ms'}}/>
            <View className={'column column-purple'} style={{animationDelay: '0'}}/>
          </View>
        </View>
      </Block>
    )
  }
}
