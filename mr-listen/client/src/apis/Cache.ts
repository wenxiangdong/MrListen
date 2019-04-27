import Logger from "../utils/logger";
import {VO} from "./HttpRequest";

export default class Cache {
  private cache = new Map<string, VO[]>();

  private logger = Logger.getLogger("Cache");

  private static INSTANCE;

  private static EXPIRE: number = 30 * 60 * 1000;

  private constructor() {
  }

  static getInstance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new Cache();
    }
    return this.INSTANCE;
  }

  private set(cacheName: string, val = []): boolean {
    if (val) {
      this.cache.set(cacheName, val);
      this.logger.info(`缓存 ${cacheName} 设置`);
      setTimeout(() => {
        this.unset(cacheName);
      }, Cache.EXPIRE);
      return true;
    } else {
      return false;
    }
  }

  private unset(cacheName: string): void {
    this.cache.delete(cacheName);
    this.logger.info(`缓存 ${cacheName} 删除`);
  }

  public init() {
    this.cache.clear();
    this.logger.info('初始化缓存');
  }

  public add(cacheName: string, data: VO, insert: boolean = true): void {
    if (data) {
      if (!this.cache.has(cacheName))
        this.set(cacheName);
      let datas = this.cache.get(cacheName);
      if (datas) {
        if (insert)
          datas.push(data);
        else
          for (let i = 0; i < datas.length; i++)
            if (datas[i]._id === data._id) {
              datas[i] = data;
              break;
            }
      }
      this.logger.info(`缓存 ${cacheName} 插入 ${data._id}`);
    }
  }

  public remove(cacheName: string, id: string | number): void {
    if (this.cache.has(cacheName)) {
      let datas = this.cache.get(cacheName);
      if (datas) {
        for (let i = 0; i < datas.length; i++)
          if (datas[i]._id === id) {
            delete datas[i];
            break;
          }
      }
    }
    this.logger.info(`缓存 ${cacheName} id ${id} 删除`);
  }

  public collection<T extends VO>(cacheName: string): Collection<T> | null {
    if (this.cache.has(cacheName)) {
      // @ts-ignore
      return new Collection(this.cache.get(cacheName));
    } else
      return null;
  }
}

export class Collection<T extends VO> {
  private datas: T[];

  constructor(datas: T[]) {
    this.datas = datas;
  }

  public orderBy(fieldPath: string, asc: boolean): Collection<T> {
    for (let i = 1; i < this.datas.length; i++) {
      for (let j = 0; j < this.datas.length - i; j++) {
        let data_j = this.datas[j];
        let data_j_plus = this.datas[j + 1];
        let result = data_j[fieldPath] - data_j_plus[fieldPath];
        if ((asc && result > 0) || (!asc && result < 0)) {
          let temp = data_j;
          this.datas[j] = data_j_plus;
          this.datas[j + 1] = temp;
        }
      }
    }
    return this;
  }

  public where(condition: object): Collection<T> {
    this.datas = this.datas
      .filter(vo => {
        for (let field in condition) {
          // noinspection JSUnfilteredForInLoop
          if (condition[field] !== vo[field])
            return false;
        }
        return true;
      });

    return this;
  }

  public skip_limit(offset: number, max: number) {
    this.datas.slice(offset, offset + max);
    return this;
  }

  public get(): T[] {
    return this.datas;
  }
}
