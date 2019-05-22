import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";
import ColorStripe from "./ColorStripe/ColorStripe";
import UserConfig, {IUserConfig} from "../../utils/user-config";
import DynamicBubbles from "./Bubbles/DynamicBubbles";

export default class DynamicBackgroundFactory extends Taro.Component {

  private userConfig: IUserConfig = {};  // 用户的自定义

  constructor(props) {
    super(props);
    this.userConfig = UserConfig.getConfig();
  }

  componentWillUpdate() {
    this.userConfig = UserConfig.getConfig();
  }

  render() {
    const {theme} = this.userConfig;
    const mode = theme ? theme.mode : 'color-stripe-candy';
    let result;

    if (!theme) {
      return <View/>
    }

    switch (mode) {
      case "color-stripe-candy": {
        result = <ColorStripe colorSet={'candy'}/>;
        break;
      }
      case "bubbles": {
        result = <DynamicBubbles/>;
        break;
      }
      case "default": {
        result = <View/>;
        break;
      }
      default: {
        result = <View/>;
        break;
      }
    }

    return result;
  }
}
