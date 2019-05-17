import Taro, {Component} from '@tarojs/taro'
import {View, Text, OpenData, Image} from '@tarojs/components'

import AppAvatar from '../../../common/AppAvatar/AppAvatar'

import enterImg from './../../../../images/enterImg.png';

import './PageOne.less'
import './../Report.less'

interface IProp {
  notFound?: boolean
}

/**
 * 报告页面第一页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageOne extends Component<IProp> {
  render() {
    let promptView = this.props.notFound
      ? (
        <View>
          <Text>倾诉报告暂未生成</Text>
          <Text>每月 1 号生成倾诉报告</Text>
        </View>
      )
      : (
        <View>
          <Image src={enterImg}/>
          <Text>点击进入</Text>
        </View>
      )
    ;

    return (
      <View className={'base-style page-1'}>
        <View>
          <AppAvatar size={24} margin={10}/>
          <View/>
          <OpenData type={'userNickName'}/>
        </View>
        <View>
          <Text>倾 诉 报 告</Text>
        </View>
        {promptView}
      </View>
    )
  }
}
