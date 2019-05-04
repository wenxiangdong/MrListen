import Taro, {Component} from '@tarojs/taro'
import {ScrollView, View, Text} from '@tarojs/components'

import Avatar from './../ChatBubble/Avatar'

import './HoleBar.less'

interface IProp {
  holeAvatarSrc: string,
  holeTitle: string,
  onDelete: () => void,
  onClick: () => void
}

interface IState {
  scrollLeft?: number,
  isSetting: boolean
}

/**
 * 树洞条组件
 * @author 张李承
 * @create 2019/4/27 10:48
 */
export default class HoleBar extends Component<IProp, IState> {

  private DELETE_OPTION_BACKGROUND_COLOR = '#ed1740';

  private height = 75;
  private halfHeight = 37;

  private scrollLeft = 0;

  constructor(props) {
    super(props);
    this.state = {
      isSetting: false
    };
  }

  private handlerTouchEnd = () => {
    if (this.scrollLeft > this.halfHeight) {
      let scrollLeft = this.height >>> 0;
      this.setState({scrollLeft: scrollLeft - 1}, () => {
        this.setState({scrollLeft: scrollLeft, isSetting: true});
      });
    } else {
      this.reset();
    }
  };

  private handleScroll = (e) => {
    this.scrollLeft = e.detail.scrollLeft;
  };

  private handleClick = (e) => {
    e.stopPropagation();
    if (this.state.isSetting) {
      this.reset();
    } else {
      this.props.onClick();
    }
  };

  private handleDeleteClicked = (e) => {
    if (this.state.isSetting) {
      e.stopPropagation();
      this.props.onDelete();
    }
  };

  private reset = () => {
    this.setState({scrollLeft: 1}, () => {
      this.setState({scrollLeft: 0, isSetting: false});
    });
  };

  render() {
    return (
      <ScrollView style={{
        height: this.height + 'px',
        whiteSpace: 'nowrap',
        display: 'inline-block'
      }}
                  onTouchEnd={this.handlerTouchEnd}
                  onScroll={this.handleScroll}
                  onClick={this.handleClick}
                  scrollWithAnimation={true}
                  scrollLeft={this.state.scrollLeft}
                  scrollX={true}
      >
        <View className={'cover'} onClick={this.reset} style={{display: this.state.isSetting? 'block': 'none'}} />
        <View className={'hole-info-view'}  style={{zIndex: this.state.isSetting? 2: 0}}>
          <Avatar src={this.props.holeAvatarSrc} size={44} margin={13}/>
          <Text>{this.props.holeTitle}</Text>
        </View>
        <View onClick={this.handleDeleteClicked}
              style={{
                backgroundColor: this.DELETE_OPTION_BACKGROUND_COLOR,
                position: 'relative',
                width: this.height + 'px',
                height: this.height + 'px',
                top: '-100%',
                left: '100%',
                color: 'white',
                textAlign: 'center',
                zIndex: this.state.isSetting? 2: 0
              }}
        >
          <Text style={{
            lineHeight: this.height + 'px',
            height: this.height + 'px'
          }}>删除</Text>
        </View>
      </ScrollView>
    )
  }
}
