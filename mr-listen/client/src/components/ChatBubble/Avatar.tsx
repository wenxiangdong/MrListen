import {Component} from "@tarojs/taro";
import * as Taro from "@tarojs/taro";
import {Image} from "@tarojs/components";
import Const from "../../apis/Const";
// import Logger from "../../utils/logger";

interface IProp {
  src?: string,
  size?: number,
  margin?: number
}
export default class Avatar extends Component<IProp> {
  // private logger = Logger.getLogger(Avatar.name);
  render(): any {
    const {src, size, margin} = this.props;
    return (
      <Image
        // @ts-ignore
        src={src}
        style={{width: size + "px", height: size + "px", borderRadius: "50%", border: "#e8eaec 1px solid", margin: margin + "px"}}/>
    );
  }
}

// @ts-ignore
Avatar.defaultProps = {
  src: Const.HOLE_DEFAULT_AVATAR_URLS[1], size: 150,
  margin: 0
};
