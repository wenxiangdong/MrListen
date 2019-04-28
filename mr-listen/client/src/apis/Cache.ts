import Logger from "../utils/logger";
import {HttpRequest, VO} from "./HttpRequest";
import IQuerySingleResult = Taro.cloud.DB.IQuerySingleResult;
import IQueryResult = Taro.cloud.DB.IQueryResult;

export default class Cache {
  private cacheMap = new Map<string, Map<string | number, VO>>();
  private base = HttpRequest.getInstance();

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

  private set(cacheName: string, val: Map<string | number, VO> = new Map<string | number, VO>()): boolean {
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

  init() {
    this.cacheMap.clear();
    this.logger.info('初始化缓存');
  }

  add(cacheName: string, data: VO): void {
    if (data) {
      if (!this.cacheMap.has(cacheName))
        this.set(cacheName);
      let cache = this.cacheMap.get(cacheName);
      if (cache) {
        cache.set(data._id, data);
      }
      this.logger.info(`缓存 ${cacheName} 插入 ${data._id}`);
    }
  }

  remove(cacheName: string, id: string | number): void {
    if (this.cacheMap.has(cacheName) && id) {
      let cache = this.cacheMap.get(cacheName);
      if (cache) {
        cache.delete(id);
      }
    }
    this.logger.info(`缓存 ${cacheName} id ${id} 删除`);
  }

  update(cacheName: string, id: string | number, data: object): void {
    if (data && this.cacheMap.has(cacheName)) {
      let cache = this.cacheMap.get(cacheName);
      if (cache) {
        let cacheData = cache.get(id);
        if (cacheData) {
          Util.copyField(cacheData, data);
        }
      }
    }
  }

  async collection<T extends VO>(cacheName: string): Promise<Collection<T>> {
    if (!this.cacheMap.has(cacheName)) {
      let skip = 0, limit = 20;
      let cache: Map<string | number, VO> = new Map<string | number, VO>();
      while (true) {
        let results = await this.base.collection(cacheName).skip(skip).limit(20).get() as IQueryResult;
        if (results.data) {
          let datas = results.data;
          // @ts-ignore
          datas.forEach(data => cache.set(data._id, Util.copyWithTimestamp<T>(data)));
          if (datas.length < limit) {
            break;
          }
          skip += limit;
        }
      }

      this.set(cacheName, cache);
    }
    // @ts-ignore
    return new Collection(cacheName, this, this.cacheMap.get(cacheName));
  }
}

export class Collection<T extends VO> {
  private base = HttpRequest.getInstance();

  private readonly name: string;
  private readonly cache: Cache;
  private readonly datas: Map<string | number, T>;

  constructor(name: string, cache: Cache, datas: Map<string | number, T>) {
    this.name = name;
    this.cache = cache;
    this.datas = datas;
  }

  async add(data: object): Promise<string | number> {
    let id = await this.base.add(name, data);

    let result = await this.base
      .doc(Const.REPLY_COLLECTION, id)
      .get() as IQuerySingleResult;

    if (result.data) {
      this.cache.add(this.name, Util.copyWithTimestamp<T>(result.data));
    }

    return id;
  }

  // orderBy(fieldPath: string, asc: boolean): this {
  //   this.datas.sort((a, b) => {
  //     let result = a[fieldPath] - b[fieldPath];
  //     return asc ? result : -result;
  //   });
  //   return this;
  // }

  where(condition: object): this {
    for (let entry of this.datas) {
      let id = entry[0];
      let vo = entry[1];
      for (let field in condition) {
        // noinspection JSUnfilteredForInLoop
        if (condition[field] !== vo[field])
          this.datas.delete(id);
      }
    }

    return this;
  }

  count(): number {
    return this.datas.size;
  }

  get(): T[] {
    let vos: T[] = [];
    for (let entry of this.datas.entries()) {
      vos.push(entry[1]);
    }
    return vos;
  }

  doc(id: string | number): Doc<T> {
    for (let entry of this.datas) {
      if (entry[0] === id)
        return new Doc<T>(id, this.name, this.cache, Util.copy(entry[1]));
    }
    return new Doc<T>(id, this.name, this.cache);
  }
}

export class Doc<T extends VO> {
  private base = HttpRequest.getInstance();

  private readonly id: string | number;
  private readonly name: string;
  private readonly cache: Cache;
  private readonly data: T;

  // @ts-ignore
  constructor(id: string | number, name: string, cache: Cache, data: T = null) {
    this.id = id;
    this.name = name;
    this.cache = cache;
    this.data = data;
  }

  async remove(): Promise<void> {
    await this.base.remove(this.name, this.id);
    this.cache.remove(this.name, this.id);
  }

  async update(data: object): Promise<void> {
    if (this.data) {
      await this.base.update(this.name, this.id, data);
      this.cache.update(this.name, this.id, data);
    }
  }

  get(): T {
    return this.data;
  }
}
