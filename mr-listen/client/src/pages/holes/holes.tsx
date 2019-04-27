import Taro, {Component, Config} from '@tarojs/taro'
import {View, ScrollView, Button} from '@tarojs/components'
import Logger from './../../utils/logger'
import {apiHub} from './../../apis/ApiHub'

import './holes.less'

/**
 * @author 张李承
 * @create 2019/4/22 23:27
 * TODO 树洞列表页面 第一次迭代要求实现
 * TODO 树洞 API 修改 mock 用于测试
 * TODO 获取时加载动画 复用于获取报告信息
 * TODO 新建 删除 更新（名称 头像）
 */
export class Holes extends Component {

  private logger = Logger.getLogger(Holes.name);

  config: Config = {
    navigationBarTitleText: '倾诉树洞'
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

  private createHole = () => {
    this.logger.info('创建新的树洞！');
  };

  render() {
    return (
      <View>
        <ScrollView className={'hole-bars-scroll-view'} scrollY={true}>
        </ScrollView>
        <Button className={'create-hole-button'} type={"default"} onClick={this.createHole}>创建新的树洞</Button>
      </View>
    )
  }
}
