import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

/**
 * @author 张李承
 * @create 2019/4/22 23:27
 * TODO 树洞列表页面 第一次迭代要求实现
 * TODO 树洞 API 修改 mock 用于测试
 * TODO 获取时加载动画 复用于获取报告信息
 * TODO 新建 删除 更新（名称 头像）
 */
export class holes extends Component {

  config: Config = {
    navigationBarTitleText: "holes"
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
        <Text>holes works</Text>
      </View>
    )
  }
}
