import Logger from "../utils/logger";
import {HttpRequest, VO} from "./HttpRequest";
import Util from "./Util";
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
    this.logger.info(`缓存 ${cacheName} 删除 ${id}`);
  }

  update(cacheName: string, id: string | number, data: VO): void {
    if (data && this.cacheMap.has(cacheName)) {
      let cache = this.cacheMap.get(cacheName);
      if (cache) {
        cache.set(id, data);
      }
    }
  }

  /**
   *  分段存取，例如访问 holeId 为 xxx 的 bubble 时，只获取服务端 holeId 为 xxx 的 bubble，同时对 xxx 进行记录
   *  parentVal 代表父节点的值（如 bubble 为 holeId），默认为 'all'（全部）
   *  condition 为 筛选条件，默认为空，即不筛选
   */
  async collection<T extends VO>(cacheName: string): Promise<Collection<T>> {
    if (!this.cacheMap.has(cacheName)) {
      this.set(cacheName, await this.getRemoteDatas<T>(cacheName));
    }
    // @ts-ignore
    return new Collection<T>(Array.from(this.cacheMap.get(cacheName).values()), cacheName, this);
  }

  private async getRemoteDatas<T>(collectionName): Promise<Map<string | number, T>> {
    let skip = 0, limit = 20;
    let datas = new Map<string | number, T>();

    while (true) {
      let results = await this.base.collection(collectionName).skip(skip).limit(limit).get() as IQueryResult;
      if (results.data) {
        // @ts-ignore
        results.data.forEach(data => datas.set(data._id, Util.copyWithTimestamp<T>(data)));
        if (results.data.length < limit) {
          break;
        }
        skip += limit;
      }
    }

    return datas;
  }
}

export class Query<T extends VO> {
  protected readonly datas: T[];

  constructor(datas: T[]) {
    this.datas = datas;
  }

  where(condition: object): Query<T> {
    let datas = Util.copy(this.datas);
    datas = datas.filter(vo => {
      for (let field in condition) {
        // noinspection JSUnfilteredForInLoop
        if (condition[field] !== vo[field]) {
          return false;
        }
      }
      return true;
    });
    return new Query<T>(datas);
  }

  orderBy(fieldPath: string, order: string): Query<T> {
    let datas = Util.copy(this.datas);
    datas = datas.sort(((a, b) => {
      return order === 'asc' ? a[fieldPath] - b[fieldPath] : order === 'desc' ? b[fieldPath] - a[fieldPath] : a - b;
    }));
    return new Query<T>(datas);
  }

  get(): T[] {
    return Util.copy(this.datas);
  }

  count(): number {
    return this.datas.length;
  }
}

export class Collection<T extends VO> extends Query<T> {
  private base = HttpRequest.getInstance();

  private readonly name: string;
  private readonly cache: Cache;

  constructor(datas: T[], name: string, cache: Cache) {
    super(datas);
    this.name = name;
    this.cache = cache;
  }

  async add(data: object): Promise<string | number> {
    let id = await this.base.add(this.name, data);

    let result = await this.base
      .doc(this.name, id)
      .get() as IQuerySingleResult;

    if (result.data) {
      this.cache.add(this.name, Util.copyWithTimestamp<T>(result.data));
    }

    return id;
  }

  doc(id: string | number): Doc<T> {
    for (let data of this.datas) {
      if (data._id === id)
        return new Doc<T>(id, this.name, this.cache, data);
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
  constructor(id: string | number, name: string, cache: Cache, data: T = {}) {
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

      let result = await this.base
        .doc(this.name, this.id)
        .get() as IQuerySingleResult;

      if (result.data) {
        this.cache.update(this.name, this.id, Util.copyWithTimestamp<T>(result.data));
      }
    }
  }

  get(): T {
    return Util.copy(this.data);
  }
}
