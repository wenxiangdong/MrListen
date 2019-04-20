import {ComponentClass} from "@tarojs/taro";
import Logger from "../utils/logger";

export default function withHello(){
  const logger = Logger.getLogger("with-hello");
  return <P extends ComponentClass>(WrappedComponent: P) => {
    return class WithHelloComponent extends WrappedComponent {
      render() {
        super.render();
      }
      componentDidMount(): void {
        logger.info("hello");
      }
    }
  }
}
