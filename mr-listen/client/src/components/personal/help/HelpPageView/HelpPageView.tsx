import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image, ScrollView} from '@tarojs/components'

import './HelpPageView.less'

export interface IProp {
  imgSrc: string,
  helpText: string[]
}

/**
 * 帮助单页组件
 * @author 张李承
 * @create 2019/5/18 19:53
 */
export default class HelpPageView extends Component<IProp> {
  render() {
    let view;
    if (this.props.helpText) {
      view = (
        <View className={'base-view'}>
          <Image className={'help-image'} src={this.props.imgSrc} mode={'aspectFit'}/>
          <ScrollView className={'help-text-view'} scrollY>
            {this.props.helpText.map((text, idx) => <Text key={`text-${idx}`} decode>{text}\n</Text>)}
          </ScrollView>
        </View>
      );
    }
    return (view)
  }
}
