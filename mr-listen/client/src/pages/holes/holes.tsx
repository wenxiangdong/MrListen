import Taro, {Component, Config} from '@tarojs/taro'
import {View, ScrollView, Button, Text} from '@tarojs/components'

import Logger from './../../utils/logger'
import Listen from "../../utils/listen"
import {apiHub} from '../../apis/ApiHub'
import {IHoleVO} from '../../apis/HoleApi'
import HoleBar from './../../components/HoleBar/HoleBar'

import './holes.less'

interface IState {
  holeVOSet: IHoleVO[]
}

/**
 * 树洞列表页面
 * @author 张李承
 * @create 2019/4/22 23:27
 * TODO 长按修改信息
 */
export class Holes extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '倾诉树洞'
  };

  private NO_MORE_HOLES = '暂时没有更多树洞';

  private logger = Logger.getLogger(Holes.name);

  private index = 0;
  private offset = 10;

  private buttonHeight = 45;

  constructor(props) {
    super(props);
    this.state = {holeVOSet: []};
  }

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
            return {holeVOSet: [...prev.holeVOSet, ...holeVOList]};
          });
        }
      })
      .catch((e) => {
        this.logger.error(e);
        Listen.message.error('获取树洞列表失败');
      })
    ;
  };

  /**
   * 创建新的树洞
   * 即 跳转到主页
   */
  private handleCreateHole = () => {
    Taro.navigateTo({
      url: '/pages/index/index'
    }).catch((e) => {
      this.logger.error(e);
      Listen.message.error('跳转失败');
    });
  };

  private handleDeleteHole = (hole) => {
    let idx = this.state.holeVOSet.indexOf(hole);
    this.logger.info('hole delete', idx);
    if (idx >= 0) {
      Taro.showModal({
        title: '提示',
        content: `确认删除树洞 ${hole.title}`
      })
        .then((res) => {
          if (res.confirm) {
            apiHub.holeApi.deleteHole(hole._id)
              .then(() => {
                this.setState((prev) => {
                  prev.holeVOSet.splice(idx, 1);
                  return {holeVOSet: prev.holeVOSet};
                });
              })
              .catch((e) => {
                this.logger.error(e);
                Listen.message.error('删除树洞失败');
              });
          }
        })
        .catch((reason) => this.logger.error(reason));
    }
  };

  private handleClickHole = (hole) => {
    // TODO 跳转到的页面还没有写 需要更新
    Taro.navigateTo({
      url: `/pages/index/index?holeId=${hole._id}`,
    }).catch((e) => {
      this.logger.error(e);
      Listen.message.error('跳转失败');
    });
  };

  render() {
    let holes = this.state.holeVOSet && this.state.holeVOSet.length
      ? this.state.holeVOSet.map((hole) =>
        <HoleBar key={hole._id}
                 holeAvatarSrc={hole.avatarUrl}
                 holeTitle={hole.title}
                 onDelete={() => this.handleDeleteHole(hole)}
                 onClick={() => this.handleClickHole(hole)}
        />
      )
    : <View className={'no-more-holes-view'}><Text>{this.NO_MORE_HOLES}</Text></View>
    ;

    return (
      <View>
        <ScrollView className={'hole-bars-scroll-view'}
                    lowerThreshold={20}
                    onScrollToLower={this.queryMoreHoles}
                    scrollY={true}>
          {holes}
          <Button style={{height: this.buttonHeight + 'px', opacity: 0}} />
        </ScrollView>
        <Button className={'create-hole-button'} style={{height: this.buttonHeight + 'px'}} type={"default"} onClick={this.handleCreateHole}>创建新的树洞</Button>
      </View>
    )
  }
}
