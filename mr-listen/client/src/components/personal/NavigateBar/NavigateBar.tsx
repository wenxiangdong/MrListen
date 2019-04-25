import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import Logger from '../../../utils/logger'
import ListenUtil from '../../../utils/listen'

import './NavigatorBar.less'

export interface NavigatorBarProp {
  url: string,
  name: string,
  icon: string
}

/**
 * 个人中心跳转条组件
 * @author 张李承
 * @create 2019/4/26 0:22
 * TODO 请 cyf 同学进行美化
 */
export default class NavigateBar extends Component<NavigatorBarProp, any> {

  private logger = Logger.getLogger(NavigateBar.name);

  private clickHandler = () => {
    Taro.navigateTo({
      url: this.props.url
    }).catch((e) => {
      this.logger.error(e);
      ListenUtil.message.error('跳转失败');
    })
  };

  render() {
    return (
      <View className={'navigate-bar'} onClick={this.clickHandler}>
        <Image className={'icon-wrapper'} src={this.props.icon} mode={"scaleToFill"}/>
        <Text className={'navigate-name-wrapper'}>{this.props.name}</Text>
      </View>
    )
  }
}
