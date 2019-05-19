import Taro, {Component, Config} from '@tarojs/taro'
import Index from './pages/index'

import './app.less'
import Logger from "./utils/logger";
import shareUtil, {ShareKeys} from "./utils/share-util";
import shakePublisher from "./utils/shake-publisher";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      // 'pages/dev/index',
      'pages/index/index',
      'pages/share/hole/hole',
      'pages/share/index',
      'pages/try/try',

      'pages/holes/holes',
      'pages/holes/update/update',
      'pages/personal/center',
      'pages/personal/report/report',
      'pages/personal/setting/setting',
      'pages/personal/help/help',
      'pages/personal/about/about',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true
  };

  private logger = Logger.getLogger("app");

  componentWillMount(): void {
    // 只能在这里获取到场景值
    this.logger.info(this.$router.params);
    const {query} = this.$router.params;
    const {holeId, userNickname} = query;
    shareUtil.setShareMessage(ShareKeys.SHARE_HOLE, {holeId, userNickname});
    // 后面如果用分享报告，也可以类似
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {
    shakePublisher.begin();
  }

  componentDidHide () {
    shakePublisher.stop();
  }

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
