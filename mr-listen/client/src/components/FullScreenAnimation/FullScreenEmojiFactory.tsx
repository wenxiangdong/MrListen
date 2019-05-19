// import FullScreenEmoji from "./FullScreenEmoji";
import Taro from "@tarojs/taro";
import Logger from "../../utils/logger";
import {Bubble} from "../../apis/BubbleApi";
import FullScreenEmoji from "./FullScreenEmoji/FullScreenEmoji";

interface IProp {
  // bubbleContent: string,
  bubble: Bubble | undefined
}

interface IState {
  component: object | null,
}

interface IKeyWordMap {
  [key: string]: string[]
}

export default class FullScreenEmojiFactory extends Taro.Component<IProp, IState> {

  constructor(props) {
    super(props);

  }

  // noinspection NonAsciiCharacters
  static keywordMap: IKeyWordMap = {
    "😂": ["好笑", "笑死", "哈哈"],
    "🤔": ["我想想", "考虑", "..."],
    "😮": ["天了", "天呐", "我的天", "my god"],
    "👍": ["赞", "好棒", "真棒"],
    "❄️": ["好冷", "温度低"],
    "💥": ["生气", "怒"],
    "🌈": ["彩虹", "gay"]
  };

  private logger = Logger.getLogger(FullScreenEmojiFactory.name);

  state = {
    component: null,
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
      return <FullScreenEmoji content={targetKey}/>
    }
  }


    shouldComponentUpdate(nextProps: Readonly<IProp>): boolean {
      if (nextProps.bubble !== this.props.bubble) {
        this.logger.info("diff bubble");
        return true;
      }
      return false;
    }
}
