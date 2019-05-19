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
 * TODO 添加背景图片
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
    // let promptView = this.props.notFound
    let promptView = (
      <View>
        <Image src={enterImg}/>
        <Text>点击进入</Text>
      </View>
    );

    return (
      <View className={'base-style page-1'}>
        <View>
          <View className={'name-bar'}>
            <AppAvatar size={50} margin={15}/>
            <OpenData className={'name'} type={'userNickName'}/>
          </View>
          <View className={'title'}>
            <Text>使用报告</Text>
          </View>
          {promptView}
        </View>
      </View>
    )
  }
}
