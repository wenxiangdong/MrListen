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
        <View className={'prompt-view'}>
          <Text className={'enter-text'}>倾诉报告暂未生成</Text>
          <Text className={'enter-text'} decode={true}>每月&nbsp;1&nbsp;号生成倾诉报告</Text>
        </View>
      )
      : (
      <View className={'prompt-view'}>
        {/*<Image className={'enter-img flashing'} src={enterImg}/>*/}
        <View className={'enter-icon'}/>
        <Text className={'enter-text'}>点击进入</Text>
      </View>
      )
    ;

    return (
      <View className={'base-page'}>
        <View className={'user-info'}>
          <AppAvatar size={24} margin={10}/>
          <View className={'user-info-vertical-separator'}/>
          <OpenData className={'user-nick-name'} type={'userNickName'}/>
        </View>
        <View className={'title-info show-up'}>
          <Text className={'report-title-text'} decode={true}>倾&nbsp;诉&nbsp;报&nbsp;告</Text>
          <Text className={'app-name-text'} decode={true}>Mr&nbsp;Listen</Text>
          <Text className={'app-intro-text'} decode={true}>倾&nbsp;听&nbsp;你&nbsp;的&nbsp;一&nbsp;切</Text>
        </View>
        {promptView}
      </View>
    )
  }
}
