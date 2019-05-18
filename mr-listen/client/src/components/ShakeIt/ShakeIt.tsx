import Taro from "@tarojs/taro";
import "./ShakeIt.less";
import {View} from "@tarojs/components";
import "@tarojs/async-await";
import Logger from "../../utils/logger";
import shakePublisher from "../../utils/shake-publisher";

interface IState {
  shake: boolean
}

export default class ShakeIt extends Taro.Component<any, IState> {

  private logger = Logger.getLogger(ShakeIt.name);

  private shaking = false;

  state = {shake: false};

  render(): any {
    const {shake} = this.state;
    return shake ? (
      <View className={"SI-wrapper"}>
        Shake it
      </View>
    ) : null;
  }

  componentDidMount(): void {
    shakePublisher.subscribe(this.handleShake);
  }


  handleShake = async () => {
    if (this.shaking) {
      return;
    }
    this.shaking = true;
    const {confirm, cancel} = await Taro.showModal({
      title: "冲一冲",
      content: "冲走此次倾诉，不留下任何痕迹",
      confirmColor: "tomato"
    });
    this.logger.info(JSON.stringify({confirm, cancel}));
    if (confirm) {

    } else if (cancel) {

    }
    this.shaking = false;
  };
}
