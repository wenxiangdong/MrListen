import Taro, {Component, Config} from '@tarojs/taro'
import {View} from '@tarojs/components'
import UserInfoBar from '../../components/common/UserInfoBar/UserInfoBar'
import NavigateBar, {NavigatorBarProp} from '../../components/personal/NavigateBar/NavigateBar'

import './center.less'

import reportPng from "../../images/personal/report-icon.png";
import helpPng from "../../images/personal/help-icon.png";
import settingPng from "../../images/personal/setting-icon.png";
import aboutPng from "../../images/personal/about-icon.png";

/**
 * 个人中心页
 * 包含 个人信息
 * 可跳转到其他页面
 *   倾诉报告
 *   个人设置
 *   关于我们
 * @author 张李承
 * @create 2019/4/22 23:16
 * TODO 请 cyf 同学进行美化
 */

interface IState {
  mounted: boolean
}

export class Center extends Component<any, IState>{

  config: Config = {
    navigationBarTitleText: '个人中心',
  };

  private navigatorBarPropArr: NavigatorBarProp[] = [
    {
      url:'/pages/personal/report/report',
      name: '倾诉报告',
      icon: reportPng
    },
    {
      url:'/pages/personal/setting/setting',
      name: '个人设置',
      icon: settingPng
    },
    {
      url:'/pages/personal/help/help',
      name: '如何使用',
      icon: helpPng
    },
    {
      url:'/pages/personal/about/about',
      name: '关于我们',
      icon: aboutPng
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      mounted: false
    }
  }


  componentDidMount () {
    setTimeout(() => {
      this.setState({mounted: true})
    }, 200)
  }

  render() {
    let {mounted} = this.state;

    return (
      <View className={'center-view'}>
        <View className={`user-bar-box ${mounted ? `fly-in-1`: ``}`}>
          <UserInfoBar/>
        </View>
        <View className={'navigator-bars-wrapper'}>
          {this.navigatorBarPropArr.map(
            (p, idx) =>
              <View key={idx} className={`nav-bar-item ${mounted ? `fly-in-${idx + 3}`: ``}`}>
                <NavigateBar url={p.url} name={p.name} icon={p.icon}/>
              </View>
          )}
        </View>
      </View>
    )
  }
}
