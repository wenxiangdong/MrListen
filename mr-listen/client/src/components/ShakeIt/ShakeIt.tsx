import Taro from "@tarojs/taro";
import "./ShakeIt.less";
import {View} from "@tarojs/components";
import "@tarojs/async-await";
import Logger from "../../utils/logger";
import shakePublisher from "../../utils/shake-publisher";

interface IState {
  shake: boolean
}

interface IProp {
  onShake: () => void
}

export default class ShakeIt extends Taro.Component<IProp, IState> {

  private logger = Logger.getLogger(ShakeIt.name);

  private shaking = false;

  state = {shake: false};

  constructor(props) {
    super(props);
    // @ts-ignore
    this.handleShake = this.throttle(this.handleShake);
  }


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

  componentWillUnmount() {
    this.logger.info("unmount");
    shakePublisher.unsubscribe(this.handleShake);
  }


  handleShake = async () => {
    if (this.shaking) {
      return;
    }
    this.shaking = true;
    const {confirm, cancel} = await Taro.showModal({
      title: "摇一摇",
      content: "确定要清空此次倾诉吗？",
      confirmColor: "#FF6347"
    });
    this.logger.info(JSON.stringify({confirm, cancel}));
    if (confirm) {
      this.props.onShake();
    } else if (cancel) {
    }
    this.shaking = false;
  };

  // 节流，能间隔一秒发出
  private throttle(method: Function, onError?) {
    const duration = 1000;
    var pre = 0;
    return function () {
      let now = +new Date();
      if (now - pre > duration) {
        method(...arguments);
        pre = now;
      } else {
        if (typeof onError === "function") onError();
      }
    }
  }
}
