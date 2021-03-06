import * as Taro from "@tarojs/taro";
import "@tarojs/async-await";
import userConfig from "./user-config";
import Logger from "./logger";
import {apiHub} from "../apis/ApiHub";
import CallFunctionResult = Taro.cloud.ICloud.CallFunctionResult;

export default class CanvasUtil {

  private ctx: Taro.CanvasContext;


  // private TEMPLATE_FILE_ID = "cloud://first-57afbf.6669-first-57afbf/share-template.jpg";
  private TEMPLATE_FILE_ID = "cloud://first-57afbf.6669-first-57afbf/bg.png";
  private PAGE = "pages/share/hole/hole";

  private logger = Logger.getLogger(CanvasUtil.name);

  constructor(private canvasId, private context, private canvasWidth, private canvasHeigth, private unit) {
    this.init();
  }

  private init() {
    this.ctx = Taro.createCanvasContext(this.canvasId, this.context);
  }

  public async drawBackground() {
    if (!this.ctx) {
      throw new Error("canvas context未初始化");
    }
    let url = await this.getTemplateTempPath();
    this.logger.info(url);
    this.ctx.drawImage(url, 0, 0, this.canvasWidth, this.canvasHeigth);
    this.ctx.draw(true, () => {
      this.logger.info("draw bg success");
    });
  }

  public async drawQRCode(holeId, expireIn) {
    if (!this.ctx) {
      throw new Error("canvas context未初始化");
    }

    let url = await this.getQRCodeTempPath(holeId, expireIn);
    this.logger.info(url);
    // url = await this.getImage(url);
    this.logger.info(holeId, expireIn, "code url", url);
    const r = 80 * this.unit / 2;
    const oX = this.canvasWidth * 7 / 8 - r;
    const oY = this.canvasHeigth - 1.6 * r;
    this.ctx.drawImage(url, oX, oY, r, r);
    this.ctx.draw(true, () => {
      this.logger.info("draw code success");
    });
  }

  public async drawAvatar() {
    if (!this.ctx) {
      throw new Error("canvas context未初始化");
    }

    this.ctx.save();
    // this.ctx.beginPath();

    const r = 32 * this.unit;
    const x = 20 * this.unit;
    const y = 450 * this.unit - r;

    // this.ctx.arc(x + r, y + r, r, 0, 2 * Math.PI, false);
    // this.ctx.clip();

    const config = userConfig.getConfig();
    this.logger.info(config);
    const url = this.getImage(config.avatarUrl);
    // @ts-ignore
    this.ctx.drawImage(url, x, y, r * 2, r * 2);
    // this.ctx.draw(true, () => {
    //   this.logger.info("draw avatar success");
    // });
    this.ctx.restore();
  }

  public drawExtraText(text) {
    if (!this.ctx) {
      return;
    }

    if (!text) {
      const {nickName} = userConfig.getConfig();
      text = `来自${nickName}的纸条`
    } else {
      text = "\u201C" + text + "\u201D";

    }

    let fontSize = 0;
    if (text.length > 8) {
      fontSize = 24 * this.unit;
    }
    else {
      fontSize = 28 * this.unit;
    }

    // const {nickName} = userConfig.getConfig();
    // if (nickName) {
    //   text = nickName + "：" + text;
    // }

    this.ctx.save();
    this.ctx.setFontSize(fontSize);
    this.ctx.setFillStyle("#ffffff");

    // @ts-ignore
    this.ctx.font = 'normal bold ' +  fontSize + 'px san-serif';

    const x = 34 * this.unit;
    const y = 100 * this.unit - fontSize / 2;
    // @ts-ignore
    this.ctx.fillText(text, x, y);
    this.ctx.draw(true);
    this.ctx.restore();
  }

  public async finish() {
    return new Promise((resolve, reject) => {
      this.ctx.draw(true, () => {
        Taro.canvasToTempFilePath({
          canvasId: this.canvasId,
          success: (res) => {
            this.logger.info("save", res);
            resolve(res);
          },
          fail: (e) => {
            this.logger.error(e);
            reject(e);
          },
          complete: () => {
            this.logger.info("complete");
          }
        }, this.context);
      });
    })
  }

  private async getQRCodeTempPath(holeId, expireIn) {
    const shareHoleId = await apiHub.shareHoleApi.createShareHole(holeId, expireIn);
    this.logger.info("share hole id", shareHoleId);
    const fileID = await apiHub.shareHoleApi.getQrCode({
      page: "pages/share/hole/hole",
      params: {
        holeId: shareHoleId,
      }
    });
    const res = await Taro.cloud.downloadFile({
      // @ts-ignore
      fileID
    });
    // @ts-ignore
    return res.tempFilePath;

  }

  private async getTemplateTempPath(): Promise<string> {
    const res = await Taro.cloud.downloadFile({
      fileID: this.TEMPLATE_FILE_ID
    });
    // @ts-ignore
    return res.tempFilePath;
  }

  private async getImage(url) {
    try {
      const res = await Taro.downloadFile({
        url
      });
      return res.tempFilePath;
    } catch (e) {
      this.logger.info("get Image", e);
      throw e;
    }
  }

}
