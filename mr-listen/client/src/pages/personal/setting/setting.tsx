import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Switch, ScrollView} from '@tarojs/components'
import userConfigUtil, {IUserConfig, bubbleColorOptions, themeOptions} from './../../../utils/user-config'
import SampleBubble from './../../../components/personal/SampleBubble'
import ColorPickerOption from './../../../components/personal/ColorPickerOption/ColorPickerOption'
import ThemeColorPickerOption from './../../../components/personal/ThemePickerOption/ThemeColorPickerOption'

import './setting.less'

interface IState {
  userConfig: IUserConfig,
  mounted: boolean
}

/**
 * 个人设置页面
 * @author 张李承
 * @create 2019/4/22 23:26
 */
export class Setting extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '个人设置',
    disableScroll: true
  };

  constructor(props) {
    super(props);
    this.state = {
      userConfig: userConfigUtil.getConfig(),
      mounted: false
    };
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({mounted: true})
    })
  }

  componentWillUnmount() {
    userConfigUtil.setConfig(this.state.userConfig);
  }

  render() {
    const {mounted} = this.state;
    const {userConfig} = this.state;

    return (
      <View className={'main-box'}>
        <View className={`menu-item ${mounted ? `fly-in-2`: ``}`}>
          <Text>动态背景</Text>
          <ScrollView className={'theme-picker'} scrollX={true}>
            {
              themeOptions.map((val, idx) =>
                <ThemeColorPickerOption key={idx} theme={val}
                                        selected={userConfig.theme ? val.mode === userConfig.theme.mode : false}
                                        onSelect={() => {
                                          this.setState({userConfig: {...this.state.userConfig, theme: val}});
                                        }}
                />
              )
            }
          </ScrollView>
        </View>
        <View className={`menu-item ${mounted ? `fly-in-3`: ``}`}>
          <Text>气泡颜色</Text>
          <View className={'color-picker'}>
            {
              bubbleColorOptions.map((val, idx) =>
                <View key={idx} className={'color-picker-option'}>
                  <ColorPickerOption color={val}
                                     selected={val === userConfig.bubbleColor}
                                     onSelect={() => {this.setState({userConfig: {...userConfig, bubbleColor: val}})}}
                  />
                </View>
              )
            }
          </View>
          <SampleBubble color={`${userConfig.bubbleColor}`}/>
        </View>
        <View className={`menu-item-with-switch ${mounted ? `fly-in-4`: ``}`}>
          <Text>摇一摇冲走烦恼</Text>
          <Switch checked={userConfig.shakeOff} onChange={(e) => {
            this.setState({userConfig: {...userConfig, shakeOff: e.detail.value}});
          }} />
        </View>
      </View>
    );
  }
}
