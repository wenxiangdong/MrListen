import "@tarojs/async-await";
import * as Taro from "@tarojs/taro";
import Logger from "../utils/logger";
import CollectionReference = Taro.cloud.DB.CollectionReference;
import DocumentReference = Taro.cloud.DB.DocumentReference;
import DatabaseCommand = Taro.cloud.DB.DatabaseCommand;
import IAddResult = Taro.cloud.DB.IAddResult;
import IRemoveResult = Taro.cloud.DB.IRemoveResult;
import IUpdateResult = Taro.cloud.DB.IUpdateResult;

export interface IHttpRequest {
  callFunction<T>(name: string, data?: object): Promise<T>;

  add(collectionName: string, data?: object): Promise<string | number>;

  remove(collectionName: string, docId: string | number): Promise<void>;

  update(collectionName: string, docId: string | number, data: object): Promise<void>;

  collection(collectionName: string): CollectionReference;

  doc(collectionName: string, docId: string | number): DocumentReference;

  command(): DatabaseCommand;
}

export interface HttpResponse<T> {
  code: HttpCode;
  data: T;
  message: string;
}

export enum HttpCode {
  SUCCESS,
  AUTHENTICATION_ERROR,
  NOT_FOUND,
  ERROR
}

export class HttpRequest implements IHttpRequest {

  private static INSTANCE: HttpRequest;

  private constructor() {

  }

  static getInstance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new HttpRequest();
    }
    return this.INSTANCE;
  }


  private logger = Logger.getLogger("IHttpRequest");

  async callFunction<T>(name: string, data: object = {}): Promise<T> {
    this.logger.info(`请求云函数[${name}]，参数：${JSON.stringify(data)}`);
    // 调用云函数
    const callResult = await Taro.cloud.callFunction({
      name,
      data
    });
    if (callResult) {
      this.logger.info(`${name}获取：${JSON.stringify(callResult)}`);
      // 解析数据
      let httpResponse = callResult.result as HttpResponse<T>;
      if (httpResponse.code === HttpCode.SUCCESS) {
        return httpResponse.data;
      } else
        throw httpResponse;
    } else
      throw new Error(`云函数[${name}]调用出错`);
  }

  private database: Taro.cloud.DB.Database = Taro.cloud.database();

  async add(collectionName: string, data: object = {}): Promise<string | number> {
    data['createTime'] = this.database.serverDate();
    data['updateTime'] = this.database.serverDate();
    let result = await this.database.collection(collectionName).add({data}) as IAddResult;

    if (result) {
      return result._id;
    } else {
      const errMsg = `插入 ${collectionName} ${JSON.stringify(data)} 失败`;
      this.logger.error(errMsg);
      throw new Error(errMsg);
    }
  }

  async remove(collectionName: string, docId: string): Promise<void> {
    let result = await this.database.collection(collectionName).doc(docId).remove() as IRemoveResult;

    if (result) {
      const errMsg = `删除 ${collectionName} ${docId} 失败`;
      this.logger.error(errMsg);
      throw new Error(errMsg);
    }
  }

  async update(collectionName: string, docId: string, data: object): Promise<void> {
    data['updateTime'] = this.database.serverDate();
    let result = await this.database.collection(collectionName).doc(docId).update({data}) as IUpdateResult;

    if (result) {
      const errMsg = `更新 ${collectionName} ${docId} ${JSON.stringify(data)} 失败`;
      this.logger.error(errMsg);
      throw new Error(errMsg);
    }
  }

  collection(collectionName: string): CollectionReference {
    return this.database.collection(collectionName);
  }

  doc(collectionName: string, docId: string | number): DocumentReference {
    return this.database.collection(collectionName).doc(docId);
  }

  command(): DatabaseCommand {
    return this.database.command;
  }
}

export class MockRequest {
  private static INSTANCE;

  private constructor() {

  }

  static getInstance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new MockRequest();
    }
    return this.INSTANCE;
  }

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

export class VO {
  _id: string | number;
  _openid: string;
  createTime: number;
  updateTime: number; // 更新时间
}
