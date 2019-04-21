import {Component} from "@tarojs/taro";
import * as Taro from "@tarojs/taro";
import {Image} from "@tarojs/components";
// import Logger from "../../utils/logger";

interface IProp {
  src?: string,
  size?: number
}
export default class Avatar extends Component<IProp> {
  // private logger = Logger.getLogger(Avatar.name);
  render(): any {
    const {src, size} = this.props;
    return (
      <Image
        // @ts-ignore
        src={src}
        style={{width: size + "px", height: size + "px", borderRadius: "50%", border: "#e8eaec 1px solid"}}/>
    );
  }
}

// @ts-ignore
Avatar.defaultProps = {
  src: "cloud://first-57afbf.6669-first-57afbf/images/avatar.jpeg", size: 150
};
