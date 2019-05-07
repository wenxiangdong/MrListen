import FullScreenEmoji from "./FullScreenEmoji";
import Taro from "@tarojs/taro";
import Logger from "../../utils/logger";
import {Bubble} from "../../apis/BubbleApi";

interface IProp {
  // bubbleContent: string,
  bubble: Bubble | undefined
}

interface IState {
  component: object | null
}

interface IKeyWordMap {
  [key: string]: string[]
}

export default class FullScreenEmojiFactory extends Taro.Component<IProp, IState> {

  // noinspection NonAsciiCharacters
  static keywordMap: IKeyWordMap = {
    "😂": ["好笑", "笑死", "哈哈"],
    "🤔": ["我想想", "考虑", "..."],
    "😮": ["天了", "天呐", "我的天", "my god"],
    "👍": ["赞", "好棒", "真棒"]
  };

  // 动画最大时间
  static MAX_TIME = 2000;

  private logger = Logger.getLogger(FullScreenEmojiFactory.name);

  state = {
    component: null
  };

  render(): any {
    const {bubble} = this.props;

    this.logger.info("render", this.props, this.state);

    if (!bubble) {
      return null;
    }

    const bubbleContent = bubble.content;
    const map = FullScreenEmojiFactory.keywordMap;
    const keys = Object.keys(map);
    let [targetKey] = keys.filter(key => {
      let keywords = map[key];
      return keywords.some(keyword =>
        bubbleContent
          .toLocaleLowerCase()
          .includes(keyword))
    });
    this.logger.info("match", targetKey);
    if (targetKey) {
      this.countDown();
      return <FullScreenEmoji content={targetKey}/>
    }
  }


    shouldComponentUpdate(nextProps: Readonly<IProp>, nextState: Readonly<IState>, nextContext: any): boolean {
      if (nextProps.bubble !== this.props.bubble) {
        this.logger.info("diff bubble");
        return true;
      }
      return false;
    }
}
