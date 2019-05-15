import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";
import ColorStripe from "./ColorStripe/ColorStripe";

interface IProp {
  type: string,
  arg?: string,
  // mode?: string
}
interface IState {

}
export default class DynamicBackgroundFactory extends Taro.Component<IProp, IState> {
  render () {
    let bg;
    const {type, arg} = this.props;
    switch (type) {
      case "ColorStripe": {
        bg = <ColorStripe colorSet={arg? arg : 'candy'}/>
      }
    }
    return (
      <View>
        {bg}
      </View>
    )
  }
}
