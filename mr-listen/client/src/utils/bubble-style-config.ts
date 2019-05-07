import {BubbleStyle} from "../apis/BubbleApi";

interface IBubbleConfigItem {
  icon: string,
  label: string,
  className: string
}

const BubbleStyleConfig: {[key: string]: IBubbleConfigItem} = {
  [BubbleStyle.NORMAL]: {
    icon: "N",
    label: "N（正常）",
    className: "bubble-normal"
  },
  [BubbleStyle.ANGRY]: {
    icon: "A",
    label: "A（不平）",
    className: "bubble-angry"
  },
  [BubbleStyle.HAPPY]: {
    icon: "H",
    label: "H（开心）",
    className: "bubble-happy"
  }
};

export default BubbleStyleConfig;
