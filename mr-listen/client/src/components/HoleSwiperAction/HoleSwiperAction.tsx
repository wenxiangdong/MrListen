import "./HoleSwiperAction.less";
import Taro from "@tarojs/taro";
import {IHoleVO} from "../../apis/HoleApi";
import {View, Text, SwiperItem, Swiper, MovableArea,MovableView} from "@tarojs/components";
import Logger from "../../utils/logger";
import Avatar from "../ChatBubble/Avatar";
import throttle from "../../utils/throttle";

interface IProp {
  hole: IHoleVO,
  onDelete?: () => void,
  onClick?: () => void,
  onUpdate?: () => void
}

interface IState {
  current: number,
  left: number
}

export default class HoleSwiperAction extends Taro.Component<IProp, IState> {
  private actions = [
    {
      label: "编辑",
      color: "#19be6b",
      action: () => null
    },
    {
      label: "删除",
      color: "#EF5350",
      action: () => null
    }
  ];

  // private SIZE = 100;
  private WIDTH = 75;

  private MAX = 750;

  private logger = Logger.getLogger(HoleSwiperAction.name);

  state = {current: 0, left: 0};

  private lastX = 0;

  constructor(props) {
    super(props);
    this.handleHMove = throttle(this.handleHMove, 50, this);
  }


  handleHMove = ({detail}) => {
    this.logger.info(detail);
    const {left} = this.state;
    if (detail.source !== "touch") {
      return;
    }
    const x = detail.x;
    this.logger.info(x, this.lastX);
    this.setState({
      left: x
    }, () => {
      this.logger.info("set x");
      // if (x - this.lastX >  0) {
      if (x > -(this.WIDTH * 1.9)) {
        this.setState({
          left: 0
        });
      } else if (left === -2 * this.WIDTH && x >= -(this.WIDTH)) {
        this.setState({
          left: 0
        });
        this.forceUpdate();
      } else if (detail.x <= -this.WIDTH * 0.5) {
        this.setState({
          left: -this.MAX
        })
      } else {
        this.logger.info("没有滚过");
        this.setState({
          left: 0
        });
      }
      this.lastX = x;
    });
  };

  handleClickHoleWrapper = () => {
    const {left} = this.state;
    if (left === -this.MAX) {
      this.logger.info("2 Width");
      this.setState({
        left: 0
      });
    } else {
      this.logger.info("select");
    }
  };

  render(): any {

    const {left} = this.state;
    const {hole = {} as IHoleVO} = this.props;
    this.logger.info("left", left);

    const actionItems = (
      <View className={"HSW-action-wrapper"}>
        {this.actions.map(action =>
          (<View
            key={action.label}
            className={"HSW-action-item"}
            style={{backgroundColor: action.color}}>
            {action.label}
          </View>)
        )}
      </View>
    );
    const holeItem = (
      <View className={"HSW-hole-wrapper"} onClick={this.handleClickHoleWrapper}>
        <View className={'hole-info-view'}>
          <Avatar src={hole.avatarUrl} size={44} margin={13}/>
          <Text>{hole.title}</Text>
        </View>
      </View>
    );
    return (
      <MovableArea className={"HSA-ma"}>
        <MovableView className={"HSA-mv"} direction={"horizontal"} onChange={this.handleHMove} x={left}>
          {holeItem}
          {actionItems}
        </MovableView>
      </MovableArea>
    );
  }
}
