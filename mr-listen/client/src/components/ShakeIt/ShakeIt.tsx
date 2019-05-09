import Taro from "@tarojs/taro";
import "./ShakeIt.less";
import {View} from "@tarojs/components";
import Logger from "../../utils/logger";

interface IState {
  shake: boolean
}

export default class ShakeIt extends Taro.Component<any, IState> {

  private logger = Logger.getLogger(ShakeIt.name);

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
    Taro.onAccelerometerChange(({x, y}) => {
      this.logger.info(x,y);
      if (Math.abs(x) > 1 && Math.abs(y) > 1) {
        this.setState({
          shake: true
        });
        Taro.stopAccelerometer();
      }
    });
  }
}
