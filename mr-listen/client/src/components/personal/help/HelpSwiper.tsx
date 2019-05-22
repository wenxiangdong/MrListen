import Taro, {Component} from '@tarojs/taro'
import {Swiper, SwiperItem, View, Button} from '@tarojs/components'

import HelpPageView, {IProp as HelpInfoItem} from './HelpPageView/HelpPageView'

import './HelpSwiper.less'

import HelpConfig from './../../../utils/help-config'

interface IProp {
  checkFirstUse?: boolean
}

interface IState {
  hide: boolean
}

/**
 * 帮助页面 Swiper
 * TODO 帮助图片
 * @author 张李承
 * @create 2019/5/18 19:54
 */
export default class HelpSwiper extends Component<IProp, IState> {

  helpInfoArray: HelpInfoItem[] = [
    {
      // 主页 1
      imgSrc: 'cloud://first-57afbf.6669-first-57afbf/mrlisten-logo-red2.png',
      helpText: [
        '倾诉页面可以发送倾诉消息',
        '还可以发送图片和录音哦'
      ]
    },
    {
      // 主页 2
      imgSrc: 'cloud://first-57afbf.6669-first-57afbf/mrlisten-logo-red2.png',
      helpText: [
        '右上角的按钮可跳转到其他页面'
      ]
    },
    {
      // 主页 3
      imgSrc: '',
      helpText: [
        '摇一摇即可冲走烦恼'
      ]
    },
    {
      // 主页 4
      imgSrc: '',
      helpText: [
        '倾诉消息解锁更多彩蛋'
      ]
    },
    {
      // 倾诉树洞列表页面
      imgSrc: '',
      helpText: [
        '之前使用过的树洞会保存在树洞列表中',
        '点击树洞可以使用该树洞继续倾诉'
      ]
    },
    {
      // 修改树洞信息
      imgSrc: '',
      helpText: [
        '树洞的头像和名称是可以编辑的'
      ]
    },
    {
      // 分享页面1
      imgSrc: '',
      helpText: [
        '设置分享时间和分享信息后即可生成分享图片'
      ]
    },
    {
      // 分享页面2
      imgSrc: '',
      helpText: [
        '图片中的二维码扫描后即可查看你所分享的树洞',
        '倾诉特效会被重现哦'
      ]
    },
    {
      // 倾诉报告
      imgSrc: '',
      helpText: [
        '倾诉报告每月一号更新'
      ]
    },
    {
      // 个人设置
      imgSrc: '',
      helpText: [
        '个人设置可以修改气泡颜色，动态背景，开启和关闭“摇一摇冲走烦恼”功能'
      ]
    },
    {
      // 如何使用
      imgSrc: '',
      helpText: [
        '可以在&nbsp;个人中心&nbsp;-&nbsp;如何使用&nbsp;进入',
        '忘记如何使用可以再来这里看看',
      ]
    },
    {
      // 关于我们
      imgSrc: '',
      helpText: [
        '关于我们的信息,隐私策略以及联系方式可以在这里看到'
      ]
    },
  ];

  private handleSkipClicked = (e) => {
    e.stopPropagation();
    this.setState({hide: true});
    HelpConfig.recordFinishHelp();
  };

  render() {
    let firstUse = HelpConfig.isFirstUse();
    let helpInfos;

    if (!this.state.hide || firstUse) {
      helpInfos = (
        this.helpInfoArray.map((info, idx) =>
          <SwiperItem className={'swiper-item'} key={`info-${idx}`}>
            <HelpPageView imgSrc={info.imgSrc} helpText={info.helpText}/>
          </SwiperItem>
        )
      );
    }

    return (
      this.props.checkFirstUse
        ? (
          (!this.state.hide && HelpConfig.isFirstUse())
            ? (
              <View className={'base-view'}>
                <View className={'cover'}>
                  <View className={'skip-button-view'}>
                    <Button size={'mini'} className={'skip-button'} onClick={this.handleSkipClicked}>
                      知道了
                    </Button>
                  </View>
                </View>
                <Swiper className={'popup-swiper'} indicatorDots>
                  {helpInfos}
                </Swiper>
              </View>
            )
            : null
        )
        : (
          <View className={'base-view'}>
            <Swiper className={'full-screen-swiper'} indicatorDots>
              {helpInfos}
            </Swiper>
          </View>
        )
    );
  }
}
