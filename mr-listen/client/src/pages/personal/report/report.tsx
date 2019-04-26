import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

/**
 * @author 张李承
 * @create 2019/4/22 23:26
 * TODO 测试页面 第一次迭代不要求实现 不知道做什么
 */
export class Report extends Component {

  config: Config = {
    navigationBarTitleText: '倾诉报告'
  };

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    return (
      <View>
        <Text>report works</Text>
      </View>
    )
  }
}
