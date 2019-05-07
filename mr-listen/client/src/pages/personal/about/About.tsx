import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import Avatar from './../../../components/ChatBubble/Avatar'

import './../../../components/common/common-zlc.less'

interface IState {
  avatarUrl: string
}

/**
 * 关于我们
 * @author 张李承
 * @create 2019/5/2 22:13
 * TODO 不知道写什么 先放着
 */
export class About extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '关于我们'
  };

  render() {
    return (
      <View className={'flex-column-start-center height-100'}>
        <View className={'flex-column-center vw-rect'}>
          <Avatar src={this.state.avatarUrl} size={100} margin={20}/>
          <Text>Mr Listen</Text>
        </View>
      </View>
    )
  }
}
