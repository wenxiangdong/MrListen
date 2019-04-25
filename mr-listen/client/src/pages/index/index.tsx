import Taro, {Component, Config} from '@tarojs/taro'
import {Block, View} from '@tarojs/components'
import './index.less'
import {BubbleVO, IHole} from "../../apis/HoleApi";
import Logger from "../../utils/logger";
import HoleDetail from '../../components/HoleDetail/HoleDetail';

interface IState {
  hole: IHole | null,
  bubbles: BubbleVO[],
  floatMenus: {
    left: any,
    right: any
  }
}

class Index extends Component<any, IState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '即刻倾诉'
  };

  state = {
    hole: null,
    bubbles: [],
    floatMenus: {
      right: {
        menus: [
          {label: "对过去的自己说"},
          {label: "删除"}
        ],
        position: [],
      },
      left: {
        menus: [
          {label: "删除"}
        ],
        position: [],
      }
    }
  };

  private logger = Logger.getLogger(Index.name);

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    // 构造悬浮菜单
    // const left = "left";
    // const right = "right";
    // const floatMenusComponents = (
    //   <Block>
    //     <FloatMenu
    //       menuList={floatMenus[left].menus}
    //       position={floatMenus[left].position}
    //       onClickMenuItem={index => this.handleClickFloatMenu(index, left)}
    //       onHide={() => this.handleHideFloatMenu(left)}
    //       visible={!!floatMenus[left].position.length}/>
    //     <FloatMenu
    //       menuList={floatMenus[right].menus}
    //       position={floatMenus[right].position}
    //       onClickMenuItem={index => this.handleClickFloatMenu(index, right)}
    //       onHide={() => this.handleHideFloatMenu(right)}
    //       visible={!!floatMenus[right].position.length}/>
    //   </Block>
    // );

    // 构建聊天气泡
    // const {bubbles} = this.state;
    // const chatBubblesComponents =

    return (
      <View className='index page'>
        <HoleDetail/>
      </View>
    )
  }

  handleClickFloatMenu = (index, part: string) => {
    this.logger.info(index, part);
  };
  handleHideFloatMenu = (part: string) => {
    const key = `floatMenus.${part}.position`;
    // @ts-ignore
    this.setState({
      [key]: []
    });
  };
}


export default Index;
