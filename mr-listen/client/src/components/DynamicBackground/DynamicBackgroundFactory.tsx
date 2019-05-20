import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";
import ColorStripe from "./ColorStripe/ColorStripe";
import UserConfig, {IUserConfig} from "../../utils/user-config";

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
      // case "music": {
      //   result = <Music/>;
      //   break;
      // }
      default: {
        result = <ColorStripe colorSet={'candy'}/>
        break;
      }
    }

    return result;
  }
}
