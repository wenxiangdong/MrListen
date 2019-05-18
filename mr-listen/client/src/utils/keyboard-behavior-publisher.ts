export enum KeyboardBehaviorTypes {
  POP,  // 键盘弹起
  HIDE  // 收起
}

interface IEmitter {
  next: (value?: any) => void;
}

/**
 * 键盘行为发布
 * 该类实现了在各处可以监听到键盘的事件，如收起弹出
 */
class KeyboardBehaviorPublisher {
  // 存储订阅信息
  private subscriberMap = new Map<KeyboardBehaviorTypes, Function[]>();

  constructor() {
    this.subscriberMap.set(KeyboardBehaviorTypes.POP, []);
    this.subscriberMap.set(KeyboardBehaviorTypes.HIDE, []);
  }


  /**
   * 订阅
   * @param type 事件类型
   * @param fn
   */
  public subscribe(type: KeyboardBehaviorTypes, fn) {
    const subscribers = this.subscriberMap.get(type);
    if (!subscribers) return;
    subscribers.push(fn);
  }

  /**
   * 解除订阅
   * @param type
   * @param fn
   */
  public unsubscribe(type: KeyboardBehaviorTypes, fn) {
    let subscribers = this.subscriberMap.get(type);
    if (!subscribers) return;
    subscribers.splice(
      subscribers.findIndex(item => item === fn),
      1
    );
  }

  private notify(type: KeyboardBehaviorTypes, value: any) {
    const subscribers = this.subscriberMap.get(type);
    if (!subscribers) return;
    subscribers
      .filter(fn => typeof fn === "function")
      .forEach(fn => fn(value));
  }

  /**
   * 获得发射器，事件源通过发射器来进行数据发射
   * @param type
   */
  public getEmitter(type: KeyboardBehaviorTypes): IEmitter {
    return {
      next: (value) => {
        this.notify(type, value);
      }
    } as IEmitter;
  }
}

const keyboardBehaviorPublisher = new KeyboardBehaviorPublisher();
export default keyboardBehaviorPublisher;
