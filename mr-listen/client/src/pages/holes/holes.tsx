import Taro, {Component, Config} from '@tarojs/taro'
import {View, ScrollView, Button, Text} from '@tarojs/components'
import Logger from './../../utils/logger'
import Listen from "../../utils/listen"
import {apiHub} from './../../apis/ApiHub'
import '@tarojs/async-await'
import {IHoleVO, IHole} from './../../apis/HoleApi'
import HoleBar from './../../components/HoleBar/HoleBar'

import './holes.less'

interface IState {
  holeVOList: IHoleVO[]
}

/**
 * 树洞列表页面
 * TODO 修改中
 * @author 张李承
 * @create 2019/4/22 23:27
 * TODO 删除
 */
export class Holes extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '倾诉树洞'
  };

  private logger = Logger.getLogger(Holes.name);

  private NO_MORE_HOLES = '暂时没有更多树洞';

  private index = 0;
  private offset = 10;

  componentWillMount() {
    // 获取树洞列表
    this.queryMoreHoles();
  }

  private queryMoreHoles = () => {
    apiHub.holeApi.getHoles(this.index, this.offset)
      .then((holeVOList) => {
        if (holeVOList.length === 0) {
          Listen.message.info(this.NO_MORE_HOLES);
        } else {
          this.index += holeVOList.length;
          this.setState((prev) => {
            return {holeVOList: [...prev.holeVOList, ...holeVOList]};
          });
        }
      })
      .catch((e) => {
        this.logger.error(e);
        Listen.message.error('获取树洞列表失败');
      })
    ;
  };

  private createHole = () => {
    Taro.navigateTo({
      url: '/pages/index/index'
    }).catch((e) => {
      this.logger.error(e);
      Listen.message.error('跳转失败');
    });
  };

  private holeDeleteHandler = (idx) => {
    this.logger.info('hole delete', idx);
    Taro.showModal({
      title: '提示',
      content: `确认删除树洞 ${this.state.holeVOList[idx].title}`
    })
      .then((res) => {
        if (res.confirm) {
          apiHub.holeApi.deleteHole(this.state.holeVOList[idx]._id)
            .then(() => {
              this.setState((prev) => {
                return {holeVOList: prev.holeVOList.splice(idx, 1)};
              });
            })
            .catch((e) => {
              this.logger.error(e);
              Listen.message.error('删除树洞失败');
            });
        }
      })
      .catch((reason) => this.logger.error(reason));
  };

  private holeClickHandler = (idx) => {
    this.logger.info('hole click', idx);
  };

  private reset;

  private coverClickHandler = (e) => {
    e.stopPropagation();
    this.reset();
    this.reset = null;
  };

  render() {
    let holes = this.state.holeVOList && this.state.holeVOList.length
      ? this.state.holeVOList.map((hole, idx) =>
        <HoleBar key={hole._id}
                 holeAvatarSrc={hole.avatarUrl}
                 holeTitle={hole.title}
                 onDelete={() => this.holeDeleteHandler(idx)}
                 onClick={() => this.holeClickHandler(idx)}
                 setReset={(reset) => {this.reset = reset}}
        />
      )
    : <View className={'no-more-holes-view'}><Text>{this.NO_MORE_HOLES}</Text></View>
    ;

    let buttonHeight = 45;

    return (
      <View>
        {
          this.reset
            ? <View onClick={this.coverClickHandler} className={'cover'} />
            : null
        }
        <ScrollView className={'hole-bars-scroll-view'} style={{height: `calc(100% + ${buttonHeight}px)`}} scrollY={true}>
          {holes}
        </ScrollView>
        <Button className={'create-hole-button'} style={{height: buttonHeight + 'px'}} type={"default"} onClick={this.createHole}>创建新的树洞</Button>
      </View>
    )
  }
}
