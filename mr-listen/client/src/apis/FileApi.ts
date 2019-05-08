import {MockRequest} from "./HttpRequest";
import * as Taro from "@tarojs/taro";
import Logger from "../utils/logger";
import UploadFileResult = Taro.cloud.ICloud.UploadFileResult;
import DeleteFileResult = Taro.cloud.ICloud.DeleteFileResult;
import DownloadFileResult = Taro.cloud.ICloud.DownloadFileResult;
import GetTempFileURLResult = Taro.cloud.ICloud.GetTempFileURLResult;
import GetTempFileURLResultItem = Taro.cloud.ICloud.GetTempFileURLResultItem;

export interface IFileApi {
  uploadFile(cloudPath: string, filePath: string): Promise<string>;

  downloadFile(fileID: string): Promise<string>;

  getTempFileURL(fileList: string[]): Promise<GetTempFileURLResultItem[]>;

  deleteFile(fileList: string[]): Promise<object[]>;
}

export class FileApi implements IFileApi {
  private logger = Logger.getLogger('FileApi');

  async uploadFile(cloudPath: string, filePath: string): Promise<string> {
    this.logger.info(`上传文件，云端存储路径 ${cloudPath}, 本地资源路径 ${filePath}`);
    try {
      // noinspection JSIgnoredPromiseFromCall
      Taro.showLoading({title: "上传文件中..."});
      let res = await Taro.cloud.uploadFile({
        //@ts-ignore
        cloudPath,
        filePath
      }) as UploadFileResult;
      return res.fileID;
    } catch (e) {
      this.logger.error(e.errMsg);
      throw e;
    } finally {
      Taro.hideLoading();
    }
  }

  async deleteFile(fileList: string[]): Promise<object[]> {
    this.logger.info(`删除文件，云文件 ID 列表 ${JSON.stringify(fileList)}`);
    try {
      // noinspection JSIgnoredPromiseFromCall
      Taro.showLoading({title: "删除文件中..."});
      let res = await Taro.cloud.deleteFile({
        fileList
      }) as DeleteFileResult;
      return res.fileList;
    } catch (e) {
      this.logger.error(e.errMsg);
      throw e;
    } finally {
      Taro.hideLoading();
    }
  }

  async downloadFile(fileID: string): Promise<string> {
    this.logger.info(`下载文件，云文件 ID ${JSON.stringify(fileID)}`);
    try {
      // noinspection JSIgnoredPromiseFromCall
      Taro.showLoading({title: "下载文件中..."});
      let res = await Taro.cloud.downloadFile({
        fileID
      }) as DownloadFileResult;
      return res.tempFilePath;
    } catch (e) {
      this.logger.error(e.errMsg);
      throw e;
    } finally {
      Taro.hideLoading();
    }
  }

  async getTempFileURL(fileList: string[]): Promise<GetTempFileURLResultItem[]> {
    this.logger.info(`获取文件真实链接，云文件 ID 列表 ${JSON.stringify(fileList)}`);
    try {
      // noinspection JSIgnoredPromiseFromCall
      Taro.showLoading({title: "下载文件中..."});
      let res = await Taro.cloud.getTempFileURL({
        fileList
      }) as GetTempFileURLResult;
      return res.fileList;
    } catch (e) {
      this.logger.error(e.errMsg);
      throw e;
    } finally {
      Taro.hideLoading();
    }
  }
}

export class MockFileApi implements IFileApi {
  private http = MockRequest.getInstance();

  // @ts-ignore
  downloadFile(fileID: string): Promise<string> {
    return this.http.success(0);
  }

  // @ts-ignore
  getTempFileURL(fileList: string[]): Promise<GetTempFileURLResultItem[]> {
    return this.http.success([]);
  }

  // @ts-ignore
  deleteFile(fileList: string[]): Promise<object[]> {
    return this.http.success([]);
  }

  // @ts-ignore
  uploadFile(cloudPath: string, filePath: string): Promise<string> {
    return this.http.success(filePath);
  }
}
