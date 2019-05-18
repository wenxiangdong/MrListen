import "./index.less";
import Taro, {Component} from "@tarojs/taro";
import {View, Image} from "@tarojs/components";
import Playback from "../../components/Playback/Playback";
import { apiHub } from "../../apis/ApiHub";
import ShakeIt from "../../components/ShakeIt/ShakeIt";

import homePng from "../../images/home.png";
import HelpSwiper from "../../components/personal/help/HelpSwiper";
import LoadingCover from "../../components/common/LoadingCover/LoadingCover";


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


  handleClickHome = () => {
    Taro.reLaunch({
      url: "/pages/index/index"
    });
  };

  render(): any {
    const {bubbles} = this.state;
    const foot = (<Image src={homePng} className={"home-icon"} onClick={this.handleClickHome} />)
    return (
      <View className={'main-box'}>
        <HelpSwiper checkFirstUse={true}/>
        <LoadingCover height={"100vh"} backgroundColor={"white"}/>
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
