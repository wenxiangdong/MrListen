import * as Taro from "@tarojs/taro";
import "@tarojs/async-await";
import userConfig from "./user-config";
import Logger from "./logger";
import {apiHub} from "../apis/ApiHub";

export default class CanvasUtil {

  private ctx: Taro.CanvasContext;



  private TEMPLATE_FILE_ID = "cloud://first-57afbf.6669-first-57afbf/share-template.jpg";

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
    const oX = this.canvasWidth / 2;
    const oY = 250 * this.unit;
    const r = 250 * this.unit / 2;
    const dX = oX - r;
    const dY = oY - r;
    this.ctx.drawImage(url, dX, dY, r * 2, r * 2);
    this.ctx.draw(true, () => {
      this.logger.info("draw code success");
    });
  }

  public async drawAvatar() {
    if (!this.ctx) {
      throw new Error("canvas context未初始化");
    }

    this.ctx.save();
    this.ctx.beginPath();

    const r = 32 * this.unit;
    const x = 20 * this.unit;
    const y = 450 * this.unit - r;

    this.ctx.arc(x + r, y + r, r, 0, 2 * Math.PI, false);
    this.ctx.clip();

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
      text = "窥探你的心"
    }
    this.ctx.save();
    const fontSize = 18 * this.unit;
    this.ctx.setFontSize(fontSize);
    this.ctx.setFillStyle("#000000");
    const x = 50 * this.unit;
    const y = 450 * this.unit + fontSize / 2;
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
    const fileID = await apiHub.shareHoleApi.createShareHole(holeId, expireIn);
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
