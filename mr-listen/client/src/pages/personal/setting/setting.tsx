import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Switch, ScrollView} from '@tarojs/components'
import userConfigUtil, {IUserConfig, bubbleColorOptions} from './../../../utils/user-config'
import SampleBubble from './../../../components/personal/SampleBubble'
import ColorPickerOption from './../../../components/personal/ColorPickerOption/ColorPickerOption'

import './setting.less'

interface IState {
  userConfig: IUserConfig,
  testSwitch: boolean
}

/**
 * @author 张李承
 * @create 2019/4/22 23:26
 * TODO 设置页面 第一次迭代不要求实现 不知道做什么
 * TODO 设置是否进行加密传输？
 * TODO 开会问问还有啥设置
 * TODO 请 cyf 同学进行美化
 */
export class Setting extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '个人设置'
  };

  constructor(props) {
    super(props);
    this.state = {
      userConfig: userConfigUtil.getConfig(),
      testSwitch: false
    };
  }

  componentWillUnmount() {
    userConfigUtil.setConfig(this.state.userConfig);
  }

  render() {
    return (
      <View className={'setting-view'}>
        <View className={'setting-bar-view'}>
          <Text>测试开关</Text>
          <Switch checked={this.state.testSwitch} onChange={(e) => this.setState({testSwitch: e.detail.value})} />
        </View>
        <View className={'setting-bar-view'}>
          <Text>气泡颜色</Text>
        </View>
        <ScrollView className={'bubble-color-options-scroll-view'} scrollX={true}>
          {
            bubbleColorOptions.map((val, idx) =>
              <ColorPickerOption key={idx} color={val}
                                 selected={val === this.state.userConfig.bubbleColor}
                                 onSelect={() => {this.setState({userConfig: {...this.state.userConfig, bubbleColor: val}})}}
              />
            )
          }
        </ScrollView>
        <SampleBubble color={this.state.userConfig.bubbleColor}/>
      </View>
    )
  }
}
