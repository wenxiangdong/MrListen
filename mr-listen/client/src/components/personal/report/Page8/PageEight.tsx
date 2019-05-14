import Taro, {Component} from '@tarojs/taro'
import {View, Text, OpenData, Button} from '@tarojs/components'

import './PageEight.less'
import './../Report.less'
import AppAvatar from "../../../common/AppAvatar/AppAvatar";

interface IProp {
  onReturnTopClick: () => void
}

/**
 * 报告页面第八页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageEight extends Component<IProp> {

  render() {
    return (
      <View className={'base-page'}>
        <View className={'user-greeting'}>
          <Text>Hi</Text>
          <OpenData className={'user-nick-name'} type={'userNickName'}/>
          <Text>:</Text>
        </View>
        <View className={'main-info show-up'}>
          <Text>不管是过去还是未来</Text>
          <Text>只要是你想说的</Text>
          <Text>都会认真倾听</Text>
          <Text decode={true}>祝&nbsp;天天开心</Text>
          <View className={'app-info-view'}>
            <AppAvatar size={40} margin={10}/>
            <View className={'app-info-vertical-separator'}/>
            <View className={'right-info-view'}>
              <Text className={'app-name-text'}>Mr Listen</Text>
              <Text className={'app-intro-text'}>倾 听 你 的 一 切</Text>
            </View>
          </View>
        </View>
        <View className={'prompt-view'}>
          <Button className={'enter-text'} onClick={this.props.onReturnTopClick}>再看一边</Button>
        </View>
      </View>
    );
  }
}
