import Taro, {Component, Config} from '@tarojs/taro'
import {View} from '@tarojs/components'
import UserInfoBar from '../../components/common/UserInfoBar/UserInfoBar'
import NavigateBar, {NavigatorBarProp} from '../../components/personal/NavigateBar/NavigateBar'

import './center.less'

// TODO 临时的 icon
import errorPng from "../../images/success.png"

/**
 * 个人中心页
 * 包含 个人信息
 * 可跳转到其他页面
 *   倾诉报告
 *   个人设置
 * @author 张李承
 * @create 2019/4/22 23:16
 * TODO 添加跳转条的 icon
 * TODO 请 cyf 同学进行美化
 */
export class Center extends Component {

  config: Config = {
    navigationBarTitleText: '个人中心',
    navigationBarBackgroundColor: '2962FF',
    navigationBarTextStyle: "white",

  };

  private navigatorBarPropArr: NavigatorBarProp[] = [
    {
      url:'/pages/personal/report/report',
      name: '倾诉报告',
      icon: errorPng
    },
    {
      url:'/pages/personal/setting/setting',
      name: '个人设置',
      icon: errorPng
    },
  ];

  render() {
    return (
      <View className={'center-view'}>
        <View className={'user-bar-box'}>
          <UserInfoBar/>
        </View>
        <View className={'navigator-bars-wrapper'}>
          {this.navigatorBarPropArr.map((p, idx) => <NavigateBar key={idx} url={p.url} name={p.name} icon={p.icon}/>)}
        </View>
      </View>
    )
  }
}
