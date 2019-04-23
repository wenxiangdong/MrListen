import "./index.less";
import * as Taro from "@tarojs/taro";
import {Component} from "@tarojs/taro";
import {View} from "@tarojs/components";
import {BubbleStyle, BubbleType} from "../../apis/BubbleApi";
import RightBubble from "../../components/ChatBubble/Bubble/RightBubble";


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
    const {shortBubble} = this.state;
    const {longBubble} = this.state;

    return (
      <View>
        <RightBubble onLongPress={this.handleLongPress} bubble={shortBubble} color={'#448AFF'}/>
        <RightBubble onLongPress={this.handleLongPress} bubble={longBubble} color={'#448AFF'}/>
      </View>
    )
  }
}
