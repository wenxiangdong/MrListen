import * as Taro from "@tarojs/taro";
import {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import FloatMenu, {MenuItem} from "../../components/common/FloatMenu/FloatMenu";
import Logger from "../../utils/logger";

interface IState {
  position: number[],
  showMenu: boolean
}

export default class Try extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: "尝试"
  };

  private logger = Logger.getLogger(Try.name);

  // private bubble: BubbleVO = {
  //   _id: 1,
  //   type: BubbleType.TEXT,
  //   style: BubbleStyle.NORMAL,
  //   content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内内容内容内容",
  //   sendTime: new Date().getTime(),
  //   replyList: [{
  //     content: "内容内容内容内容内容内",
  //     sendTime: new Date().getTime()
  //   },{
  //     content: "内容内容内容内容内容内容内容内容内容内容内容内",
  //     sendTime: new Date().getTime()
  //   }]
  // };

  private readonly menus: MenuItem[] = [];

  constructor(props) {
    super(props);
    this.menus = Array.apply(null, {length: 3}).map((_, index): MenuItem=> {
      return {
        label: `菜单${index}`
      }
    });
    this.menus[2].color = "tomato";

    this.state = {
      position: [],
      showMenu: false
    }
  }

  private handleClickMenu = (index) => {
    this.logger.info(index);
  };

  private handleLongPress = (e) => {
    e.stopPropagation();
    this.logger.info("长按 ");
    this.setState({
      position: [e.detail.x, e.detail.y],
      showMenu: true
    });
    this.logger.info(e);
  };

  private handleHideMenu = (e) => {
    e.stopPropagation();
    this.setState({showMenu: false, position: []})
  };

  render(): any {
    const {position, showMenu} = this.state;
    this.logger.info("showMenu", showMenu);
    return (
      <View onLongPress={this.handleLongPress} style={{width: "100vw", height: "100vh"}}>
        <FloatMenu
          visible={!!position.length}
          menuList={this.menus}
          position={position}
          onHide={this.handleHideMenu}
          onClickMenuItem={this.handleClickMenu}/>
      </View>
    )
  }
}
