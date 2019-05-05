import "./ShareCanvas.less";
import Taro, {Component} from "@tarojs/taro";
import {View, Canvas} from "@tarojs/components";
import Logger from "../../utils/logger";
import CanvasUtil from "../../utils/canvas-util";
import Listen from "../../utils/listen";

interface IState {
  canvasWidth: number,
  canvasHeight: number
}

export default class ShareCanvas extends Component<any, IState> {


  private CANVAS_ID = "post";
  private UNIT = 1;

  private canvasWidth = 350;
  private canvasHeight = 500;

  private logger = Logger.getLogger(ShareCanvas.name);
  private canvasUtil: CanvasUtil;

  constructor(props) {
    super(props);
  }

  componentWillMount(): void {
    const sysInfo = Taro.getSystemInfoSync();
    this.logger.info(sysInfo);
    this.UNIT = sysInfo.windowWidth / 375;
    this.canvasWidth = this.canvasWidth * this.UNIT;
    this.canvasHeight = this.canvasHeight * this.UNIT;
    this.forceUpdate();
    this.canvasUtil = new CanvasUtil(this.CANVAS_ID, this.$scope, this.canvasWidth, this.canvasHeight, this.UNIT);
  }

  async componentDidMount(): void {
    try {
      await this.canvasUtil.drawBackground();
      await this.canvasUtil.drawQRCode("pages/share/index", {a: 1});
      await this.canvasUtil.drawAvatar();
      await this.canvasUtil.drawNickName();
      this.forceUpdate();
    } catch (e) {
      Listen.message.error("制图失败");
      this.logger.error(e);
    }
    // this.canvasUtil.drawBackground()
    //   .then(() => {
    //     // this.forceUpdate()
    //   })
    //   .catch(e => {
    //     Listen.message.error("制作分享图片失败");
    //     this.logger.error(e);
    //   })

  }

  handleClickSave = async () => {

    try {
      await Taro.authorize({scope: "scope.writePhotosAlbum"});
    } catch (e) {
      Listen.message.error("授权失败");
      return;
    }

    try {
      const res = await this.canvasUtil.finish();
      this.logger.info(res);
      // @ts-ignore
      const path = res.tempFilePath;
      await Taro.saveImageToPhotosAlbum({
        filePath: path
      });
      Listen.message.success("快去分享吧");
    } catch (e) {
      Listen.message.error("图片保存失败");
      return;
    }



  };

  render(): any {
    return (
      <View>
        <Canvas style={{width: this.canvasWidth + "px", height: this.canvasHeight + "px"}} canvasId={this.CANVAS_ID}/>
        <View className={"SC-btn"} style={{width: this.canvasWidth + "px"}} onClick={this.handleClickSave}>
          保存到相册后分享到朋友圈
        </View>
      </View>
    )
  }
}
