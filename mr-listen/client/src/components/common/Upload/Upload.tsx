import Taro, {Component} from "@tarojs/taro";
import {View, Image} from "@tarojs/components";
import uploadSVG from "../../../images/upload.svg";
import "./Upload.less";

export default class Upload extends Component {
  render(): any {
    return (
      <View className={"Upload-wrapper"}>
        <Image className={"Upload-icon"} src={uploadSVG}/>
      </View>
    )
  }
}
