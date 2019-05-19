import Taro, {Component, Config} from '@tarojs/taro'

import HelpSwiper from '../../../components/personal/help/HelpSwiper'

/**
 * 帮助页面
 * @author 张李承
 * @create 2019/5/8 15:47
 */
export class help extends Component {

  config: Config = {
    navigationBarTitleText: '如何使用'
  };

  render() {
    return (<HelpSwiper/>)
  }
}
