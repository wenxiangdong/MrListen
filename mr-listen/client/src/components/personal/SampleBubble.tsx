import Taro, {Component} from "@tarojs/taro";
import {Text, View} from "@tarojs/components";
import SendTime from "../ChatBubble/Bubble/SendTime";
import UserAvatar from "../common/UserAvator/UserAvatar";

import "./../ChatBubble/Bubble/RightBubble.less";
import "./../ChatBubble/ChatBubble.less";

interface IProp {
  color: string
}

/**
 * 示例气泡组件
 * @author 张李承
 * @create 2019/4/26 8:31
 */
export default class SampleBubble extends Component<IProp> {
  render(): any {
    return (
      <View>
        <View className={"right-flex bubble-item"}>
          <View className={"avatar-wrapper"}>
            <UserAvatar size={44} margin={3}/>
          </View>
          <View className={"Right-wrapper bubble"} style={{backgroundColor: this.props.color}}>
            <Text className={"Right-text bubble-text"}>气泡内容</Text>
            <SendTime time={new Date().getTime()} textColor={"white"}/>
          </View>
        </View>
      </View>
    )
  }
}

