import Taro, {Component} from '@tarojs/taro'
import {ScrollView, View, Text, Image} from '@tarojs/components'
import Avatar from './../ChatBubble/Avatar'
import '@tarojs/async-await'

import deleteSrc from './../../images/failed.png'
import infoSrc from './../../images/info.png'

import './HoleBar.less'

interface IProp {
  holeAvatarSrc: string,
  holeTitle: string,
  onDelete: () => void,
  onClick: () => void,
  onCheckInfo: () => void,
  onScrollToLeft: () => void,
  onScrollToRight: () => void,
  isSetting: boolean
}

interface IState {
  scrollLeft: number,
  isSetting: boolean
}

/**
 * 树洞条组件
 * @author 张李承
 * @create 2019/4/27 10:48
 */
export default class HoleBar extends Component<IProp, IState> {

  private DELETE_OPTION_BACKGROUND_COLOR = '#ed1740';
  private DELETE_OPTION_IMG_SRC = deleteSrc;

  private INFO_OPTION_BACKGROUND_COLOR = '#1a82ea';
  private INFO_OPTION_IMG_SRC = infoSrc;

  private height = 75;

  private scrollLeft = 0;

  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: 0,
      isSetting: false
    };
  }

  private setIsSetting = () => {
    console.log('is setting');
    this.setState({scrollLeft:150, isSetting: true});
  };

  private setIsNotSetting = () => {
    console.log('is not setting');
    this.setState({scrollLeft:0, isSetting: false});
  };

  private touchEndHandler = (e) => {
    e.stopPropagation();
    console.log('touch end');
    this.scrollLeft < this.height
      ? this.setIsNotSetting()
      : this.setIsSetting();
  };

  private scrollToLowerHandler = (e) => {
    console.log('to lower');
    e.stopPropagation();
    this.setScrollLeft = this.setIsSetting;
    // this.props.onScrollToLeft();
  };

  private scrollToUpperHandler = (e) => {
    console.log('to upper');
    e.stopPropagation();
    this.setScrollLeft = this.setIsNotSetting;
    // this.props.onScrollToRight();
  };

  private clickHandler = (e) => {
    e.stopPropagation();
    if (this.props.isSetting) {
      this.setState({scrollLeft:0});
      this.props.onScrollToRight();
    } else {
      this.props.onClick();
    }
  };

  private deleteHandler = (e) => {
    e.stopPropagation();
    (this.props.isSetting) && this.props.onDelete();
  };

  private infoHandler = (e) => {
    e.stopPropagation();
    (this.props.isSetting) && this.props.onCheckInfo();
  };

  private scrollHandler = (e) => {
    e.stopPropagation();
    this.scrollLeft = e.detail.scrollLeft;
  };

  render() {
    let holeInfoView = (
      <View className={'hole-info-view'}>
        <Avatar src={this.props.holeAvatarSrc} size={44} margin={13}/>
        <Text>{this.props.holeTitle}</Text>
      </View>
    );

    let optionBackgroundColorArr = [
      this.DELETE_OPTION_BACKGROUND_COLOR,
      this.INFO_OPTION_BACKGROUND_COLOR
    ];

    let optionOnClickHandlerArr = [
      this.deleteHandler,
      this.infoHandler
    ];

    let optionImgSrcArr = [
      this.DELETE_OPTION_IMG_SRC,
      this.INFO_OPTION_IMG_SRC
    ];

    let optionRect = optionBackgroundColorArr.map((backgroundColor, idx) => {
      return (
        <View style={{
                backgroundColor: backgroundColor,
                position: 'relative',
                width: this.height + 'px',
                height: this.height + 'px',
                top: - 100 * (idx + 1) + '%',
                left: `calc(100% + ${this.height * idx}px`
              }}
              onClick={optionOnClickHandlerArr[idx]}>
          <Image className={'option-rect-image'} mode={"scaleToFill"} src={optionImgSrcArr[idx]}/>
        </View>
      )
    });

    return (
      <ScrollView className={'hole-bar-scroll-view'}
                  style={{height: this.height + 'px', zIndex: this.state.isSetting? 10: 4}}
                  onClick={this.clickHandler}
                  onTouchEnd={this.touchEndHandler}
                  onScroll={this.scrollHandler}
                  scrollWithAnimation={true}
                  scrollLeft={this.state.scrollLeft}
                  scrollX={true}
      >
        {holeInfoView}{optionRect}
      </ScrollView>
    )
  }
}
