import Taro, {Component} from '@tarojs/taro'

import Avatar from './../../ChatBubble/Avatar'

export interface IProp {
  size?: number,
  margin?: number
}

/**
 * 小程序头像组件
 * @author 张李承
 * @create 2019/5/12 11:06
 */
export default class AppAvatar extends Component<IProp, any> {

  // 小程序头像路径
  readonly appAvatarUrl = 'cloud://first-57afbf.6669-first-57afbf/mrlisten-logo-red2.png';

  render() {
    return (
      <Avatar src={this.appAvatarUrl} size={this.props.size} margin={this.props.margin}/>
    )
  }
}
