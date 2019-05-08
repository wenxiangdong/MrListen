import "@tarojs/async-await";
import * as Taro from "@tarojs/taro";
import Logger from "../utils/logger";
import Util from "./Util";
import CollectionReference = Taro.cloud.DB.CollectionReference;
import DocumentReference = Taro.cloud.DB.DocumentReference;
import DatabaseCommand = Taro.cloud.DB.DatabaseCommand;
import IAddResult = Taro.cloud.DB.IAddResult;
import IRemoveResult = Taro.cloud.DB.IRemoveResult;
import IUpdateResult = Taro.cloud.DB.IUpdateResult;
import ServerDate = Taro.cloud.DB.ServerDate;
import IServerDateOptions = Taro.cloud.DB.IServerDateOptions;

export interface IHttpRequest {
  callFunction<T>(name: string, data?: object): Promise<T>;

  add(collectionName: string, data?: object): Promise<string | number>;

  remove(collectionName: string, docId: string | number): Promise<void>;

  update(collectionName: string, docId: string | number, data: object): Promise<void>;

  collection(collectionName: string): CollectionReference;

  doc(collectionName: string, docId: string | number): DocumentReference;

  command(): DatabaseCommand;

  serverDate(option?: IServerDateOptions): ServerDate;
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
    this.logger.info(`请求云函数【${name}】，参数：${JSON.stringify(data)}`);
    // 调用云函数
    try {
      const callResult = await Taro.cloud.callFunction({
        name,
        data
      });
      if (callResult) {
        // 解析数据
        let httpResponse = callResult.result as HttpResponse<T>;
        // this.logger.info(`【${name}】获取：${JSON.stringify(httpResponse)}`);
        if (httpResponse.code === HttpCode.SUCCESS) {
          return Util.copyWithTimestamp<T>(httpResponse.data);
        } else
          throw httpResponse;
      } else
        throw new Error(`云函数[${name}]调用出错`);
    } catch (e) {
      throw e;
    }
  }

  private database: Taro.cloud.DB.Database = Taro.cloud.database();

  async add(collectionName: string, data: object = {}): Promise<string | number> {
    try {
      delete data['_id'];
      delete data['_openid'];

      data['createTime'] = this.database.serverDate();

      let result = await this.database.collection(collectionName).add({data}) as IAddResult;

      if (result) {
        return result._id;
      } else {
        const errMsg = `插入 ${collectionName} ${JSON.stringify(data)} 失败`;
        this.logger.error(errMsg);
        throw new Error(errMsg);
      }
    } catch (e) {
      throw e;
    }
  }

  async remove(collectionName: string, docId: string | number): Promise<void> {
    try {
      let result = await this.database.collection(collectionName).doc(docId).remove() as IRemoveResult;

      if (!result) {
        const errMsg = `删除 ${collectionName} ${docId} 失败`;
        this.logger.error(errMsg);
        throw new Error(errMsg);
      }
    } catch (e) {
      throw e;
    }
  }

  async update(collectionName: string, docId: string | number, data: object): Promise<void> {
    try {
      delete data['_id'];
      delete data['_openid'];

      let result = await this.database.collection(collectionName).doc(docId).update({data}) as IUpdateResult;

      if (!result) {
        const errMsg = `更新 ${collectionName} ${docId} ${JSON.stringify(data)} 失败`;
        this.logger.error(errMsg);
        throw new Error(errMsg);
      }
    } catch (e) {
      throw e;
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

  serverDate(option?: Taro.cloud.DB.IServerDateOptions): Taro.cloud.DB.ServerDate {
    if (option) {
      return this.database.serverDate(option);
    } else {
      return this.database.serverDate()
    }
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
}
