import * as Taro from "@tarojs/taro";
import {Component} from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./SendTime.less";


interface IProp {
  time: number,
  textColor?: string
}

export default class SendTime extends Component<IProp> {

  render(): any {
    const {time, textColor} = this.props;
    const dateString = new Date(time).toLocaleTimeString();
    return (
      <View className={"SendTime-wrapper"} style={{color: textColor}}>
        {dateString}
      </View>
    );
  }
}
