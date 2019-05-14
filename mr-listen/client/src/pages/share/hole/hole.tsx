import Taro from "@tarojs/taro";
import {Image, View} from "@tarojs/components";
import homePng from "../../../images/home.png";
import {apiHub} from "../../../apis/ApiHub";
import {BubbleVO} from "../../../apis/BubbleApi";
import shareUtil, {ShareKeys} from "../../../utils/share-util";
import Logger from "../../../utils/logger";
import Playback from "../../../components/Playback/Playback";
import "./hole.less";

interface IState {
  bubbles: BubbleVO[]
}


export default class Hole extends Taro.Component<any, IState> {
  constructor(props) {
    super(props);

    this.state = {
      bubbles: []
    }
  }

  private logger = Logger.getLogger("hole");

  handleClickHome = () => {
    Taro.reLaunch({
      url: "/pages/index/index"
    });
  };

  render(): any {
    const {bubbles} = this.state;
    const foot = (<Image src={homePng} className={"hole-home-icon"} onClick={this.handleClickHome}/>);
    return (
      <View className={'main-box'}>
        <Playback bubbles={bubbles} renderFooter={foot}/>
      </View>
    )
  }

  componentDidMount() {
    // 获取分享参数
    const shareParam = shareUtil.getShareMessage(ShareKeys.SHARE_HOLE);
    this.logger.info("拿到的id", shareParam.holeId);
    Taro.setNavigationBarTitle({
      title: `${shareParam.userNickname}的分享`
    });
    apiHub.holeApi.getBubblesFromHole(shareParam.holeId)
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
