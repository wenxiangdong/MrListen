import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

/**
 * 关于我们
 * @author 张李承
 * @create 2019/5/2 22:13
 * TODO 不知道写什么 先放着
 */
export class About extends Component {

  config: Config = {
    navigationBarTitleText: '关于我们'
  };

  render() {
    return (
      <View>
        <Text>About Us</Text>
        <Text>不知道写什么先放着</Text>
        <Text>咱好懒啊ε=(´ο｀*)))唉</Text>
      </View>
    )
  }
}
