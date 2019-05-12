import "./HoleSwiperAction.less";
import Taro from "@tarojs/taro";
import {IHoleVO} from "../../apis/HoleApi";
import {View, Text, MovableArea,MovableView} from "@tarojs/components";
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
  // private SIZE = 100;
  private WIDTH = 75;

  private MAX = 750;

  private logger = Logger.getLogger(HoleSwiperAction.name);

  state = {current: 0, left: 0};

  private lastX = 0;

  constructor(props) {
    super(props);
    this.handleHMove = throttle(this.handleHMove, 100, this);
  }


  handleHMove = ({detail}) => {
    this.logger.info(detail);
    const {left} = this.state;
    if (!detail.source) {
      return;
    }
    const x = detail.x;
    this.logger.info(x, this.lastX);
    this.logger.info("set x");
    // if (x - this.lastX >  0) {
    if (left === -2 * this.WIDTH && x >= -(this.WIDTH)) {
      this.setState({
        left: x
      }, () => {
        this.setState({
          left: 0
        })
      });
    } else if (detail.x <= -this.WIDTH) {
      this.setState({
        left: -this.MAX
      })
    } else {
      this.logger.info("没有滚过");
      this.setState({
        left: x
      }, () => {
        this.setState({
          left: 0
        })
      });
    }
    this.lastX = x;
    // this.setState({
    //   left: x
    // }, () => {
    //
    // });
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
      const {onClick} = this.props;
      if (typeof onClick === "function") {
        onClick();
      }
    }
  };

  // handleClickEdit = () => {
  //   const {onUpdate} = this.props;
  //   this.setState({
  //     left: 0
  //   });
  //   if (typeof onUpdate === "function") {
  //     onUpdate();
  //   }
  // };
  //
  // handleClickDelete = () => {
  //   const {onDelete} = this.props;
  //   this.setState({
  //     left: 0
  //   });
  //   if (typeof onDelete === "function") {
  //     onDelete();
  //   }
  // };

  private actions = [
    {
      label: "编辑",
      color: "#19be6b",
      action: () => {
        const {onUpdate} = this.props;
        this.setState({
          left: 0
        });
        if (typeof onUpdate === "function") {
          onUpdate();
        }
      }
    },
    {
      label: "删除",
      color: "#EF5350",
      action: () => {
        const {onDelete} = this.props;
        this.setState({
          left: 0
        });
        if (typeof onDelete === "function") {
          onDelete();
        }
      }
    }
  ];

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
            onClick={() => action.action()}
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
        <MovableView className={"HSA-mv"} inertia={true} direction={"horizontal"} onChange={this.handleHMove} x={left}>
          {holeItem}
          {actionItems}
        </MovableView>
      </MovableArea>
    );
  }
}
