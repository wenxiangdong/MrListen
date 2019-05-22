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

interface IProp {
  text: string,
  expireIn: number,
  holeId: string | number,
  onError: () => void
}

export default class ShareCanvas extends Component<IProp, IState> {


  private CANVAS_ID = "post";
  private UNIT = 1;

  private canvasWidth = 350;
  private canvasHeight = 200;

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

  async componentDidMount() {
    const {holeId, expireIn, onError} = this.props;
    try {
      Listen.showLoading("加工中...");
      await this.canvasUtil.drawBackground();
      await this.canvasUtil.drawQRCode(holeId, expireIn);
      // await this.canvasUtil.drawAvatar();  // 画头像一直出错我也不知道为什么
      await this.canvasUtil.drawExtraText(this.props.text);
      this.forceUpdate();
    } catch (e) {
      Listen.message.error("制图失败");
      this.logger.error(e);
      if (typeof onError === "function") {
        onError();
      }
    } finally {
      Listen.hideLoading();
    }
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
      Listen.message.success("保存成功");
    } catch (e) {
      Listen.message.error("图片保存失败");
      return;
    }



  };

  render(): any {


    return (
      <View className={"SC-wrapper"}>
        <Canvas style={{width: this.canvasWidth + "px", height: this.canvasHeight + "px"}} canvasId={this.CANVAS_ID}/>
        <View className={"SC-btn"} onClick={this.handleClickSave}>
          保存到相册
        </View>
      </View>
    )
  }
}
