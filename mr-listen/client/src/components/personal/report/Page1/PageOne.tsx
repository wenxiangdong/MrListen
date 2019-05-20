import Taro, {Component} from '@tarojs/taro'
import {View, Text, OpenData, Image} from '@tarojs/components'

import AppAvatar from '../../../common/AppAvatar/AppAvatar'

import enterImg from './../../../../images/enterImg.png';

import './PageOne.less'
import './../Report.less'

interface IProp {
  notFound?: boolean
}

interface IState {
  mounted: boolean
}

/**
 * 报告页面第一页
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageOne extends Component<IProp, IState> {
  constructor(props) {
    super(props);

    this.state = {mounted: false};
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({mounted: true});
    }, 200)
  }

  render() {
    const {mounted} = this.state;

    return (
      <View className={`base-style page-1 ${mounted ? `` : `transparent`}`}>
        <View>
          <View className={'title'}>
            <View className={'align-text'}>
              <View className={`title-text text-align-last ${mounted ? `word-fly-in-1` : ``}`}>使用报告</View>
              <View className={`subtitle text-align-last ${mounted ? `word-fly-in-3` : ``}`}>让我们从最初的相遇开始</View>
            </View>
          </View>
          <View className={`name-bar ${mounted ? `word-fly-in-5` : ``}`}>
            <AppAvatar size={40} margin={15}/>
            <OpenData className={'name'} type={'userNickName'}/>
          </View>
        </View>
        <View className={`tip ${mounted ? `word-fly-in-6` : ``}`}>点击进入</View>
      </View>
    )
  }
}
