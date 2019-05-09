import Taro from "@tarojs/taro";
import "./ShakeIt.less";
import {View} from "@tarojs/components";
import "@tarojs/async-await";
import Logger from "../../utils/logger";

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
    Taro.onAccelerometerChange(this.handleShake);
  }


  handleShake = async ({x, y}) => {
    if (this.shaking) return;
    this.logger.info(x, y);
    if (Math.abs(x) > 1 && Math.abs(y) > 1) {
      try {
        this.shaking = true;
        await Taro.stopAccelerometer();
        const {confirm, cancel} = await Taro.showModal({
          title: "冲一冲",
          content: "冲走此次倾诉，不留下任何痕迹",
          confirmColor: "tomato"
        });
        this.logger.info(JSON.stringify({confirm, cancel}));
        if (confirm) {

        } else if (cancel) {

        }
        Taro.onAccelerometerChange(this.handleShake);
        this.shaking = false;
      } catch (e) {
        this.logger.error(e);
      }
    }
  };
}
