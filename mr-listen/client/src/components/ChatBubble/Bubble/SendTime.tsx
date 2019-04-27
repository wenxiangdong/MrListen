import * as Taro from "@tarojs/taro";
import {Component} from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./SendTime.less";
import Logger from "../../../utils/logger";


interface IProp {
  time: any,
  textColor?: string
}

export default class SendTime extends Component<IProp> {

  private logger = Logger.getLogger(SendTime.name);

  render(): any {
    const {time, textColor} = this.props;
    this.logger.info(time);
    const dateString = new Date(time).toLocaleString();
    // const dateString = time.toLocaleString();
    return (
      <View className={"SendTime-wrapper"} style={{color: textColor}}>
        {dateString}
      </View>
    );
  }
}
