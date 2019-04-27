import Taro, {Component} from '@tarojs/taro'
import {ScrollView, View, Text, Image} from '@tarojs/components'
import Avatar from './../ChatBubble/Avatar'

import deleteSrc from './../../images/failed.png'
import infoSrc from './../../images/info.png'

import './HoleBar.less'

interface IProp {
  holeAvatarSrc: string,
  holeTitle: string,
  onDelete: () => void,
  onClickHole: () => void,
  onStartUpdating: () => void,
  onStartSet: () => void,
  onStopSet: () => void,
  isSetting: boolean
}

interface IState {
  scrollLeft: number
}

/**
 * 树洞条组件
 * @author 张李承
 * @create 2019/4/27 10:48
 */
export default class HoleBar extends Component<IProp, IState> {

  private DELETE_OPTION_BACKGROUND_COLOR = '#ed1740';
  private INFO_OPTION_BACKGROUND_COLOR = '#1a82ea';

  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: this.props.isSetting? 150: 0
    };
    console.log(this.props)
  }

  private scrollToLowerHandler = (e) => {
    e.stopPropagation();
    if (!this.props.isSetting) {
      this.setState({scrollLeft:150});
      this.props.onStartSet();
    }
  };

  private scrollToUpperHandler = (e) => {
    e.stopPropagation();
    if (this.props.isSetting) {
      this.setState({scrollLeft:0});
      this.props.onStopSet();
    }
  };

  private clickHandler = (e) => {
    e.stopPropagation();
    if (this.props.isSetting) {
      this.setState({scrollLeft:0});
      this.props.onStopSet();
    } else {
      this.props.onClickHole();
    }
  };

  private deleteHandler = (e) => {
    e.stopPropagation();
    (this.props.isSetting) && this.props.onDelete();
  };

  private updateHandler = (e) => {
    e.stopPropagation();
    (this.props.isSetting) && this.props.onStartUpdating();
  };

  render() {
    let scrollView = this.props.isSetting
      ? 'hole-bar-scroll-view is-setting-view'
      : 'hole-bar-scroll-view'
    ;

    return (
      <ScrollView className={scrollView}
                  style={{height: 75 + 'px'}}
                  onClick={this.clickHandler}
                  lowerThreshold={125}
                  onScrollToLower={this.scrollToLowerHandler}
                  upperThreshold={125}
                  onScrollToUpper={this.scrollToUpperHandler}
                  scrollWithAnimation={true}
                  scrollLeft={this.state.scrollLeft}
                  scrollX={true}
      >
        <View className={'hole-info-view'}>
          <Avatar src={this.props.holeAvatarSrc} size={44} margin={13}/>
          <Text>{this.props.holeTitle}</Text>
        </View>
        <View style={{backgroundColor: this.DELETE_OPTION_BACKGROUND_COLOR,
                position: 'relative',
                width: '75px',
                height: '75px',
                top: '-100%',
                left: '100%'
              }}
              onClick={this.deleteHandler}>
          <Image className={'option-block-image'} mode={"scaleToFill"} src={deleteSrc}/>
        </View>
        <View style={{backgroundColor: this.INFO_OPTION_BACKGROUND_COLOR,
                position: 'relative',
                width: '75px',
                height: '75px',
                top: '-200%',
                left: 'calc(100% + 75px)'
              }}
              onClick={this.updateHandler}>
          <Image className={'option-block-image'} mode={"scaleToFill"} src={infoSrc}/>
        </View>
      </ScrollView>
    )
  }
}
