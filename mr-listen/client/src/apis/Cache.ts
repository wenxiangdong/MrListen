import Logger from "../utils/logger";
import {VO} from "./HttpRequest";

export default class Cache {
  private cacheMap = new Map<string, VO[]>();

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
      this.cacheMap.set(cacheName, val);
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
    this.cacheMap.delete(cacheName);
    this.logger.info(`缓存 ${cacheName} 删除`);
  }

  public init() {
    this.cacheMap.clear();
    this.logger.info('初始化缓存');
  }

  public add(cacheName: string, data: VO): void {
    if (data) {
      if (!this.cacheMap.has(cacheName))
        this.set(cacheName);
      let cache = this.cacheMap.get(cacheName);
      if (cache) {
        cache.push(data);
      }
      this.logger.info(`缓存 ${cacheName} 插入 ${data._id}`);
    }
  }

  public remove(cacheName: string, id: string | number): void {
    if (this.cacheMap.has(cacheName)) {
      let cache = this.cacheMap.get(cacheName);
      if (cache) {
        for (let i = 0; i < cache.length; i++)
          if (cache[i]._id === id) {
            delete cache[i];
            break;
          }
      }
    }
    this.logger.info(`缓存 ${cacheName} id ${id} 删除`);
  }

  public update(cacheName: string, data: VO): void {
    if (data && this.cacheMap.has(cacheName)) {
      let cache = this.cacheMap.get(cacheName);
      if (cache) {
        for (let i = 0; i < cache.length; i++)
          if (cache[i]._id === data._id) {
            cache[i] = data;
            break;
          }
      }
    }
  }

  public collection<T extends VO>(cacheName: string): Collection<T> | null {
    if (this.cacheMap.has(cacheName)) {
      // @ts-ignore
      return new Collection(this.cacheMap.get(cacheName));
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
