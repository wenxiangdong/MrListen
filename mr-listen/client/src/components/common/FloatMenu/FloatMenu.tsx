import Taro, {clientRectElement} from "@tarojs/taro";
import {View} from "@tarojs/components";
import Logger from "../../../utils/logger";
import "./FloatMenu.less";
export interface MenuItem {
  label: string,  // 要显示的菜单文字
  color?: string, // 菜单颜色
}
interface IProp {
  menuList: MenuItem[],
  position: number[],
  onClickMenuItem: (index) => void, // 按某个菜单时的回调，参数为选中的菜单在menuList中的index
  onHide: (e) => void, // 要关闭时的操作
  visible: boolean
}
interface IState {
  size: number[]  // 本菜单的大小
}
export default class FloatMenu extends Taro.Component<IProp, IState> {

  private logger = Logger.getLogger(FloatMenu.name);

  // 默认配置
  private defaultColor = "#17233d";

  state = {
    size: [0, 0]
  };

  componentDidMount(): void {
    // 获取组件大小
    this.initSize();
  }

  /**
   * 获取菜单组的总大小
   */
  private initSize() {
    let query = Taro.createSelectorQuery();
    // 要区分环境
    if (process.env.TARO_ENV === "h5") {
      query = query.in(this);
    } else {
      query = query.in(this.$scope)
    }
    query.select("#menus").boundingClientRect((rect: clientRectElement) => {
      const {width, height} = rect;
      this.setState({
        size: [width, height]
      })
    }).exec();
  }

  /**
   * 计算位置
   */
  private calcPositionStyle() {
    const {position} = this.props;
    const {size} = this.state;
    // 构造位置样式
    const [x, y] = position;
    const [width, height] = size;
    let [xOffset, yOffset] = [-width, -height];  // 用于计算菜单位置是否应该相对于鼠标位置有位移
    let transformOrigin = "bottom";
    if (y <= height) {
      yOffset = 0;
      transformOrigin = "top";
    }
    if (x < width) {
      xOffset = 0;
    }

    return {
      left: `${x + xOffset}px`,
      top: `${y + yOffset}px`,
      transformOrigin
    };
  }

  render() {
    this.logger.info(this.props);
    const {menuList, visible} = this.props;
    // 构造菜单项
    const MenuItems = menuList.map((menu, index) => (
      <View
        className={"FM-item"}
        key={menu.label}
        onClick={(e) => this.handleClickMenuItem(e, index)}
        style={{color: menu.color || this.defaultColor}}>
        {menu.label}
      </View>
    ));

    // 构造位置样式
    const positionStyle = this.calcPositionStyle();
    this.logger.info("positionStyle", positionStyle);

    // 构造可见性
    const visibility = visible ? "visible" : "hidden";

    return (
      <View className={"FM-cover"} onClick={this.props.onHide} style={{visibility}}>
        <View id={"menus"} className={`FM-wrapper${visible ? ' scale-in' : ''}`} style={positionStyle}>
          {MenuItems}
        </View>
      </View>
    );
  }


  handleClickMenuItem = (e, index) => {
    e.stopPropagation();
    this.logger.info(e);
    const {onClickMenuItem, onHide} = this.props;
    onClickMenuItem(index);
    onHide(e);
  }
}

// // @ts-ignore
// FloatMenu.defaultProps = {
//   menuList: [],
//   position: [],
//   onClickMenuItem: () => null,
//   onHide: () => null, // 要关闭时的操作
//   visible: false
// };
