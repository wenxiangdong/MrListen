import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'

import './HelpPageView.less'

interface IProp {
  imgSrc: string
}

/**
 * 帮助单页组件
 * @author 张李承
 * @create 2019/5/18 19:53
 */
export default class HelpPageView extends Component<IProp> {
  render() {
    return (
      <View className={'base-view'}>
        <Image className={'help-image'} src={this.props.imgSrc} mode={'aspectFit'}/>
      </View>
    );
  }
}
