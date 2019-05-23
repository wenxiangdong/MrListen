import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";

import './ShootingStar.less'

export default class ShootingStar extends Taro.Component {
  render(): any {
    return (
      <View className="wrapper">
        <View className="night">
          <View className="star" />
          <View className="star" />
          <View className="star"/>
          <View className="star"/>
          <View className="star"/>
        </View>
      </View>
    );
  }
}
