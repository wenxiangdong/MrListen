import "./index.less";
import * as Taro from "@tarojs/taro";
import {Component} from "@tarojs/taro";
import {View} from "@tarojs/components";
import Playback from "../../components/Playback/Playback";
import { apiHub } from "../../apis/ApiHub";
import HoleSwiperAction from "../../components/HoleSwiperAction/HoleSwiperAction";
import ShakeIt from "../../components/ShakeIt/ShakeIt";


export default class Index extends Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {
      bubbles: []
    }
  }


  private handleLongPress = (bubble) => {
    console.log(bubble);
  };

  render(): any {
    const {bubbles} = this.state;
    return (
      <View className={'main-box'}>
        {/*<Playback bubbles={bubbles}/>*/}
        {/* {bubbles.length ? <Playback bubbles={bubbles}/> : null} */}
        {/*<BubbleTypePicture />*/}
        <HoleSwiperAction/>
        <HoleSwiperAction/>
        <ShakeIt/>
      </View>
    )
  }

  componentDidMount() {
    apiHub.holeApi.getBubblesFromHole("id")
    .then(res => {
      console.log(res);
      this.setState({
        bubbles: res
      })
    })
    .catch(e => {
      console.error(e);
    })
  }
}
