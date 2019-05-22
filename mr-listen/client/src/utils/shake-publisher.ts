import Taro from "@tarojs/taro";
import Logger from "./logger";

class ShakePublisher {

  private logger = Logger.getLogger(ShakePublisher.name);

  private subscribers: (() => void)[] = [];

  // 是否运转中，可以通过
  private running = false;

  public begin() {
    this.running = true;
    Taro.onAccelerometerChange(this.handleAccelerometerChange);
  }

  public stop() {
    this.running = false;
    Taro.stopAccelerometer();
  }

  public subscribe(subscriber: () => void) {
    this.subscribers.push(subscriber);
  }

  public unsubscribe(subscriber: () => void) {
    this.subscribers
      .splice(
        this.subscribers.findIndex(s => s === subscriber),
        1
      );
  }

  private handleAccelerometerChange = ({x, y}) => {
    if (!this.running) return;
    // this.logger.info(x, y);
    const edge = 1;
    if (Math.abs(x) > edge && Math.abs(y) > edge) {
      this.subscribers
        .filter(s => typeof s === "function")
        .forEach(s => s());
    }
  }
}


const shakePublisher = new ShakePublisher();
export default shakePublisher;
