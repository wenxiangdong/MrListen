import Taro, {Component} from '@tarojs/taro'
import {View, OpenData} from '@tarojs/components'
import UserAvatar from '../UserAvator/UserAvatar'

import './UserInfoBar.less'

/**
 * 用户信息条组件
 * @author 张李承
 * @create 2019/4/25 23:53
 * TODO 请 cyf 同学进行美化
 */
export default class UserInfoBar extends Component {
  render() {
    return (
      <View className={'user-info-bar'}>
        <UserAvatar size={60} margin={20}/>
        <OpenData className={'normal-text sm-margin user-data'} type={"userNickName"}/>
      </View>
    )
  }
}
