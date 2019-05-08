import Taro, {Component} from '@tarojs/taro'
import {ScrollView, View, Text} from '@tarojs/components'

import Avatar from './../ChatBubble/Avatar'

import './HoleBar.less'
import Listen from '../../utils/listen';

interface IProp {
  holeAvatarSrc: string,
  holeTitle: string,
  onDelete: () => void,
  onClick: () => void,
  onUpdate: () => void
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

  private DELETE_OPTION = '删除';
  private UPDATE_OPTION = '修改';
  private ITEM_LIST = [this.DELETE_OPTION, this.UPDATE_OPTION];

  constructor(props) {
    super(props);
    this.state = {
      isSetting: false
    };
  }

  private handleLongPress = () => {
    Taro.showActionSheet({
      itemList: this.ITEM_LIST
    })
      .then((e) => {
        if (e.tapIndex >= 0) {
          if (this.ITEM_LIST[e.tapIndex] === this.DELETE_OPTION) {
            this.props.onDelete();
          } else if (this.ITEM_LIST[e.tapIndex] === this.UPDATE_OPTION) {
            this.props.onUpdate();
          } else {
            throw Error(`tapIndex 不匹配 ${e.tapIndex}`);
          }
        }
      })
      .catch((e) => {
        const {errMsg = ''} = e;
        console.error(e);
        // 是不是取消了
        if (!errMsg.includes('cancel')) {
          Listen.message.error('出错了');
        }
      })
  };

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
      Taro.showModal({
        title: '提示',
        content: `确认删除树洞 ${this.props.holeTitle}`
      })
        .then((res) => {
          if (res.confirm) {
            this.props.onDelete();
          }
        })
        .catch((reason) => console.error(reason));
    }
  };

  private reset = () => {
    this.setState({scrollLeft: 1}, () => {
      this.setState({scrollLeft: 0, isSetting: false});
    });
  };

  render() {
    return (
      <ScrollView className={'hole-bar-scroll-view'}
                  style={{
                    height: this.height + 'px'
                  }}
                  onLongPress={this.handleLongPress}
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
