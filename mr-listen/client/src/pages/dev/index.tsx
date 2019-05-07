import "./index.less";
import * as Taro from "@tarojs/taro";
import {Component} from "@tarojs/taro";
import {View} from "@tarojs/components";
import {BubbleStyle, BubbleType} from "../../apis/BubbleApi";
import RightBubble from "../../components/ChatBubble/Bubble/RightBubble";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import InputBar from "../../components/HoleDetail/InputBar/InputBar";
import BubbleTypePicture from "../../components/HoleDetail/InputBar/BubbleType/BubbleTypePicture";
import Playback from "../../components/Playback/Playback";


export default class Index extends Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {
      shortBubble: {
        _id: 'id',
        holeId: 123123123,
        type: BubbleType.TEXT,
        style: BubbleStyle.NORMAL,
        content: "Hello",
        sendTime: 3123123,
      },
      longBubble: {
        _id: 'id',
        holeId: 123123123,
        type: BubbleType.TEXT,
        style: BubbleStyle.NORMAL,
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, cum cumque esse eveniet hic laborum natus nesciunt officiis optio possimus praesentium soluta totam unde. Ab architecto ea excepturi qui soluta!",
        sendTime: 3123123,
      }
    }
  }


  private handleLongPress = (bubble) => {
    console.log(bubble);
  };

  render(): any {
    return (
      <View className={'main-box'}>
        <Playback holeId={"hole"}/>
        {/*<BubbleTypePicture />*/}
      </View>
    )
  }
}
