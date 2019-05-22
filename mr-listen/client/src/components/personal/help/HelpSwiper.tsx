import Taro, {Component} from '@tarojs/taro'
import {Swiper, SwiperItem, View, Button} from '@tarojs/components'

import HelpPageView from './HelpPageView/HelpPageView'

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

  helpImgSrcs: string[] = [
    // 主页1倾诉
    'cloud://first-57afbf.6669-first-57afbf/mrlisten-logo-red2.png',
    // 主页2跳转
    'cloud://first-57afbf.6669-first-57afbf/mrlisten-logo-red2.png',
    // 主页3冲一冲
    '',
    // 主页4倾诉彩蛋
    '',
    // 倾诉树洞列表页面
    '',
    // 修改树洞信息
    '',
    // 分享页面1
    '',
    // 分享页面2 TODO
    '',
    // 倾诉报告
    '',
    // 个人设置
    '',
    // 如何使用 TODO
    '',
    // 关于我们
    '',
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
        this.helpImgSrcs.map((src, idx) =>
          <SwiperItem className={'swiper-item'} key={`info-${idx}`}>
            <HelpPageView imgSrc={src}/>
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
