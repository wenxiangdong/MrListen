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
        '倾诉页面可以发送消息进行倾诉',
        '倾诉的方式多种多样：文字&nbsp;图片&nbsp;录音',
        '可跳转到其他页面',
        '&nbsp;树洞列表页面\n&nbsp;个人中心页面\n&nbsp;分享页面'
      ]
    },
    {
      // 主页 2
      imgSrc: '',
      helpText: [
        '开启“摇一摇冲走烦恼”后，在倾诉页面摇一摇有特效哦',
        '发送“哈哈哈”试试？\n——更多彩蛋特效等着你来探索哦'
      ]
    },
    {
      // 倾诉树洞列表页面
      imgSrc: '',
      helpText: [
        '倾诉树洞列表会显示你已有的树洞',
        '点击树洞可以使用对该树洞继续倾诉',
        '也可以新建一个树洞进行倾诉',
        '树洞向左滑会显示操作按钮：&nbsp;删除&nbsp;编辑',
        '树洞的头像和名称都可以被编辑'
      ]
    },
    {
      // 分享页面
      imgSrc: '',
      helpText: [
        '分享页面可以设置分享时间',
        '分享需要提供昵称',
        '生成的分享页面包含二维码可以保存到本地'
      ]
    },
    {
      // 倾诉报告
      imgSrc: '',
      helpText: [
        '可以在&nbsp;个人中心&nbsp;-&nbsp;倾诉报告&nbsp;进入',
        '倾诉报告每月一号生成',
        '截图到本地后就可以分享哦'
      ]
    },
    {
      // 个人设置
      imgSrc: '',
      helpText: [
        '可以在&nbsp;个人中心&nbsp;-&nbsp;个人设置&nbsp;进入',
        '个人设置可以修改&nbsp;气泡颜色&nbsp;动态背景&nbsp;开启和关闭“摇一摇冲走烦恼”功能',
        '动态背景持续更新中~~~敬请期待'
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
        '可以在&nbsp;个人中心&nbsp;-&nbsp;关于我们&nbsp;进入',
        '可以在这里看到关于我们的信息&nbsp;隐私策略以及联系方式'
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
                      跳过
                    </Button>
                  </View>
                </View>
                <Swiper className={'popup-swiper'} indicatorDots>
                  {helpInfos}
                </Swiper>
              </View>
            )
            : <View/>
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
