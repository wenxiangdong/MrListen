import Taro, {Component} from '@tarojs/taro'
import {ScrollView, View, Text, Image} from '@tarojs/components'
import Avatar from './../ChatBubble/Avatar'
import '@tarojs/async-await'

import deleteSrc from './../../images/failed.png'

import './HoleBar.less'

interface IProp {
  holeAvatarSrc: string,
  holeTitle: string,
  onDelete: () => void,
  onClick: () => void,
  setReset: (e) => void
}

interface IState {
  isSetting: boolean,
  isMoving: boolean
}

/**
 * 树洞条组件
 * @author 张李承
 * @create 2019/4/27 10:48
 */
export default class HoleBar extends Component<IProp, IState> {

  private DELETE_OPTION_BACKGROUND_COLOR = '#ed1740';
  private DELETE_OPTION_IMG_SRC = deleteSrc;

  private height = 75;

  private scrollLeft = 0;

  constructor(props) {
    super(props);
    this.state = {
      isSetting: false,
      isMoving: false
    };
  }

  private touchStartHandler = (e) => {
    e.stopPropagation();
    console.log('touch start');
    this.setState({isMoving:true});
  };

  private touchEndHandler = (e) => {
    e.stopPropagation();
    console.log('touch end');
    if (this.scrollLeft < 10) {
      this.setState({isMoving:false, isSetting: false});
    } else {
      this.setState({isMoving:false, isSetting: true});
    }
  };

  private scrollHandler = (e) => {
    e.stopPropagation();
    this.scrollLeft = e.detail.scrollLeft;
  };

  private clickHandler = (e) => {
    e.stopPropagation();
    if (this.state.isSetting) {
      this.setState({isSetting: false});
    } else {
      this.props.onClick();
    }
  };

  private deleteHandler = (e) => {
    e.stopPropagation();
    (this.state.isSetting) && this.props.onDelete();
  };

  private reset = () => {
    this.setState({
      isSetting: false,
      isMoving: false
    });
  };

  render() {
    let holeInfoView = (
      <View className={'hole-info-view'}>
        <Avatar src={this.props.holeAvatarSrc} size={44} margin={13}/>
        <Text>{this.props.holeTitle}</Text>
      </View>
    );
    let deleteView = (
      <View style={{
        backgroundColor: this.DELETE_OPTION_BACKGROUND_COLOR,
        position: 'relative',
        width: this.height + 'px',
        height: this.height + 'px',
        top: '-100%',
        left: '100%'
      }}
            onClick={this.deleteHandler}>
        <Image className={'option-rect-image'} mode={"scaleToFill"} src={this.DELETE_OPTION_IMG_SRC}/>
      </View>
    );

    let movingScrollView = (
      <ScrollView className={'hole-bar-scroll-view'}
                  style={{height: this.height + 'px', zIndex: 10}}
                  onTouchEnd={this.touchEndHandler}
                  onScroll={this.scrollHandler}
                  scrollWithAnimation={true}
                  scrollX={true}
      >
        {holeInfoView}
        {deleteView}
      </ScrollView>
    );

    let unmovingScrollView = (
      <ScrollView className={'hole-bar-scroll-view'}
                  style={{height: this.height + 'px', zIndex: this.state.isSetting? 10: 4}}
                  onTouchStart={this.touchStartHandler}
                  onClick={this.clickHandler}
                  scrollLeft={
                    this.state.isSetting
                      ? this.height
                      : 0
                    }
                  scrollX={true}
      >
        {holeInfoView}
        {deleteView}
      </ScrollView>
    );

    return (
      this.state.isMoving
        ? movingScrollView
        : unmovingScrollView
    )
  }
}
