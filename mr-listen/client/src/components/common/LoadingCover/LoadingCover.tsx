import "./LoadingCover.less";
import loadingPng from "../../../images/loading.png";
import Taro, {Component} from "@tarojs/taro";
import {View, Image, Text} from "@tarojs/components";
import Logger from "../../../utils/logger";

interface IProp {
  height: string,
  backgroundColor: string,
  tip: string
}
export default class LoadingCover extends Component<IProp> {

  static defaultProps = {
    height: "0",
    backgroundColor: "white",
    tip: "加载中..."
  };


  private logger = Logger.getLogger(LoadingCover.name);

  render(): any {
    this.logger.info(this.props);
    return (
      <View className={"LBC-wrapper"} style={{
        width: "100vw",
        height: this.props.height,
        backgroundColor: this.props.backgroundColor}}>
        <View className={"LBC-main"}>
          <Image className={"LBC-loading"} src={loadingPng} />
          <Text className={"LBC-tip"}>{this.props.tip}</Text>
        </View>
      </View>
    );
  }
}
