import * as Taro from "@tarojs/taro";
import Logger from "../utils/logger";
import "@tarojs/async-await";
import UploadFileResult = Taro.cloud.ICloud.UploadFileResult;

export interface IHttpRequest {
  request<T>(name: string, params?: object): Promise<T>;

  /**
   * 上传文件
   * @param holeId
   * @param filePath
   * @return 新的文件地址
   */
  uploadFile(holeId: number, filePath: string): Promise<string>;
}

export class HttpRequest implements IHttpRequest{

  private static INSTANCE;
  public static getInstance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new HttpRequest();
    }
    return this.INSTANCE;
  }

  private  logger = Logger.getLogger("IHttpRequest");
  public async request<T>(name: string, params: object = {}): Promise<T> {
    try {
      this.logger.info(`请求【${name}】，参数：${JSON.stringify(params)}`);
      // 调用云函数
      const callResult = await Taro.cloud.callFunction({
        name,
        data: params
      });
      if (callResult) {
        this.logger.info(`请求${name}得到：${JSON.stringify(callResult)}`);
        // 解析数据
        let httpResponse = callResult.result as HttpResponse<T>;
        if (httpResponse.code === HttpCode.SUCCESS) {
          return httpResponse.data;
        } else {
          throw httpResponse;
        }
      } else {
        throw new Error(`云函数[${name}]调用出错`);
      }
    } catch (e) {
      throw e;
    }
  }

  public async uploadFile(holeId: number, filePath: string): Promise<string> {
    this.logger.info(holeId, filePath);
    try {
      Taro.showLoading({title: "上传文件中..."});
      let res = await Taro.cloud.uploadFile({
        cloudPath: `holdId/${new Date().getTime()}`,
        filePath: filePath
      }) as UploadFileResult;
      return res.fileID;
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      Taro.hideLoading();
    }
  }
}

export class MockRequest {
  private async timeout(time = 1000) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }
  async success<T>(data: T = {} as T): Promise<T> {
    await this.timeout();
    return data;
  }
}

export enum HttpCode {
  SUCCESS,
  AUTHENCATION_ERROR,
  NOT_FOUND,
  ERROR
}

export interface HttpResponse<T> {
  code: HttpCode;
  data: T;
  message: string;
}
