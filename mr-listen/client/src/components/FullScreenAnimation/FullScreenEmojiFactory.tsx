// import FullScreenEmoji from "./FullScreenEmoji";
import Taro from "@tarojs/taro";
import Logger from "../../utils/logger";
import {Bubble} from "../../apis/BubbleApi";
import FullScreenEmoji from "./FullScreenEmoji/FullScreenEmoji";
import {apiHub} from "../../apis/ApiHub";

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
    apiHub.userApi.getEmoji()
      .then(res => {
        this.logger.info("拿到的表为", res);
        this.keywordMap = {...res};
      })
      .catch(this.logger.error);
  }

  // noinspection NonAsciiCharacters
  // 将为从数据库获取
  private keywordMap: IKeyWordMap = {
    //   "😂": ["好笑", "笑死", "哈哈"],
    //   "🤔": ["我想想", "考虑", "..."],
    //   "😮": ["天了", "天呐",  "天啊", "我的天", "my god"],
    //   "👍": ["赞", "好棒", "真棒"],
    //   "❄️": ["好冷", "温度低"],
    //   "💥": ["生气", "怒"],
    //   "🌈": ["彩虹", "gay"],
    //   "💕": ["我爱你", "我爱他", "爱情"]
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
    const map = this.keywordMap;
    const keys = Object.keys(map);
    let [targetKey] = keys.filter(key => {
      let keywords = map[key];
      return keywords.some(keyword =>
        bubbleContent
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
