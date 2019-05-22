import Taro from "@tarojs/taro";
import {Image, View} from "@tarojs/components";
import homePng from "../../../images/home.png";
import likePng from "../../../images/like.png";
import likePngWhite from "../../../images/like_white.png";
import likePngRed from "../../../images/like_red.png";
import {apiHub} from "../../../apis/ApiHub";
import {BubbleVO} from "../../../apis/BubbleApi";
import shareUtil, {ShareKeys} from "../../../utils/share-util";
import Logger from "../../../utils/logger";
import Playback from "../../../components/Playback/Playback";
import "./hole.less";
import {ShareHoleVO} from "../../../apis/ShareHoleApi";
import Listen from "../../../utils/listen";

interface IState {
  bubbles: BubbleVO[],
  shareHole: ShareHoleVO | null,
  like: boolean,
  liking: boolean
}


export default class Hole extends Taro.Component<any, IState> {
  constructor(props) {
    super(props);

    this.state = {
      bubbles: [],
      shareHole: null,
      like: false,
      liking: false
    }
  }

  private logger = Logger.getLogger("hole");

  private likePngs = {
    "true": likePngRed.toString(),
    "false": likePngWhite.toString()
  };

  handleClickHome = () => {
    Taro.reLaunch({
      url: "/pages/index/index"
    });
  };

  handleClickLike = () => {
    if (this.state.like) {
      return;
    }

    this.setState({
      liking: true
    });
    // @ts-ignore
    apiHub.shareHoleApi.plusOne(this.state.shareHole._id)
      .then(() => {
        this.setState({
          like: true,
          liking: false
        });
      })
      .catch(e => {
        this.logger.error(e);
        this.setState({
          liking: false
        });
      })
  };

  render(): any {
    const {bubbles, like, liking} = this.state;
    // const foot = (<Image src={homePng} className={"hole-home-icon"} onClick={this.handleClickHome}/>);
    const foot = (
      <View>
        <Image src={homePng} className={"hole-home-icon"} onClick={this.handleClickHome}/>
        <Image src={this.likePngs[String(like)]} className={`hole-home-icon ${!like && liking ? "liking" : ""}`} onClick={this.handleClickLike}/>
      </View>
    );
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
      title: `分享回放`
    });
    apiHub.shareHoleApi.getShareHole(shareParam.holeId)
      .then(res => {
        this.logger.info(res);
        const hole = res.snapShot;
        this.logger.info(hole);
        // @ts-ignore
        this.setState({
          bubbles: hole.bubbleVOs,
          shareHole: hole
        });
      })
      .catch(e => {
        this.logger.error(e);
        Listen.message.error("分享被偷吃掉啦");
        setTimeout(() => {
          this.handleClickHome();
        }, 1000);
      })
    // apiHub.holeApi.getBubblesFromHole(shareParam.holeId)
    //   .then(res => {
    //     console.log(res);
    //     this.setState({
    //       bubbles: res
    //     })
    //   })
    //   .catch(e => {
    //     console.error(e);
    //   })
  }
}
