import Taro, {Component, Config} from '@tarojs/taro'
import {View, ScrollView, Button, Text} from '@tarojs/components'

import Logger from './../../utils/logger'
import Listen from '../../utils/listen'
import {apiHub} from '../../apis/ApiHub'
import {IHoleVO} from '../../apis/HoleApi'
import HoleBar from './../../components/HoleBar/HoleBar'

import './holes.less'
import HoleSwiperAction from "../../components/HoleSwiperAction/HoleSwiperAction";

interface IState {
  holeVOSet: IHoleVO[]
}

/**
 * 树洞列表页面
 * @author 张李承
 * @create 2019/4/22 23:27
 */
export class Holes extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '倾诉树洞'
  };

  private UPDATE_HOLE_URL = '/pages/holes/update/update';
  private INDEX_URL = '/pages/index/index';
  private NO_MORE_HOLES = '暂时没有更多树洞';

  private logger = Logger.getLogger(Holes.name);

  private lastHoleId: string | number = 0;
  private offset = 10;

  private buttonHeight = 45;
  private isQuery = false;

  constructor(props) {
    super(props);
    this.state = {holeVOSet: []};
  }

  componentWillMount() {
    // 获取树洞列表
    this.queryMoreHoles();
  }

  private queryMoreHoles = () => {
    if (!this.isQuery) {
      this.isQuery = true;
      Listen.showLoading('获取中');
      apiHub.holeApi.getHoles(this.lastHoleId, this.offset)
        .then((holeVOList) => {
          if (holeVOList.length === 0) {
            Listen.hideLoading();
            Listen.message.info(this.NO_MORE_HOLES);
          } else {
            this.lastHoleId = holeVOList[holeVOList.length - 1]._id;
            this.setState((prev) => {
              return {holeVOSet: [...prev.holeVOSet, ...holeVOList]};
            });
            Listen.hideLoading();
          }
          this.isQuery = false;
        })
        .catch((e) => {
          this.logger.error(e);
          Listen.hideLoading();
          Listen.message.error('获取树洞列表失败');
          this.isQuery = false;
        })
      ;
    }
  };

  private handleScrollToLower = () => {
    this.queryMoreHoles();
  };

  /**
   * 创建新的树洞
   * 即 跳转到主页
   */
  private handleCreateHole = () => {
    Taro.navigateTo({
      url: this.INDEX_URL
    }).catch((e) => {
      this.logger.error(e);
      Listen.message.error('跳转失败');
    });
  };

  private handleDeleteHole = (hole) => {
    let idx = this.state.holeVOSet.indexOf(hole);
    if (idx >= 0) {
      this.logger.info('hole delete', idx);
      Listen.showLoading('删除中');
      apiHub.holeApi.deleteHole(hole._id)
        .then(() => {
          this.setState((prev) => {
            prev.holeVOSet.splice(idx, 1);
            return {holeVOSet: prev.holeVOSet};
          });
          Listen.hideLoading();
          this.forceUpdate();
        })
        .catch((e) => {
          this.logger.error(e);
          Listen.hideLoading();
          Listen.message.error('删除树洞失败');
        });
    }
  };

  private handleClickHole = (hole) => {
    Taro.navigateTo({
      url: `${this.INDEX_URL}?holeId=${hole._id}`
    }).catch((e) => {
      this.logger.error(e);
      Listen.message.error('跳转失败');
    });
  };

  private handleUpdateHole = (hole) => {
    Taro.navigateTo({
      url: encodeURI(`${this.UPDATE_HOLE_URL}?hole=${JSON.stringify(hole)}`)
    }).catch((e) => {
      this.logger.error(e);
      Listen.message.error('跳转失败');
    });
  };

  render() {
    // {/*<HoleBar key={hole._id}*/}
    // {/*holeAvatarSrc={hole.avatarUrl}*/}
    // {/*holeTitle={hole.title}*/}
    // {/*onDelete={() => this.handleDeleteHole(hole)}*/}
    // {/*onClick={() => this.handleClickHole(hole)}*/}
    // {/*onUpdate={() => this.handleUpdateHole(hole)}*/}
    // {/*/>*/}
    let holes = this.state.holeVOSet && this.state.holeVOSet.length
      ? this.state.holeVOSet.map((hole) =>
        <HoleSwiperAction
          hole={hole}
          onDelete={() => this.handleDeleteHole(hole)}
          onClick={() => this.handleClickHole(hole)}
          onUpdate={() => this.handleUpdateHole(hole)}
        />
      )
      : <View className={'no-more-holes-view'}><Text>{this.NO_MORE_HOLES}</Text></View>
    ;

    return (
      <View>
        <ScrollView className={'hole-bars-scroll-view'}
                    lowerThreshold={1}
                    onScrollToLower={this.handleScrollToLower}
                    scrollY={true}>
          {holes}
          <Button style={{height: this.buttonHeight + 'px', opacity: 0}}/>
        </ScrollView>
        <Button className={'create-hole-button'} style={{height: this.buttonHeight + 'px'}} type={'default'}
                onClick={this.handleCreateHole}>创建新的树洞</Button>
      </View>
    )
  }
}
