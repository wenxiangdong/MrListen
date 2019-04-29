import Taro, {Component, Config} from '@tarojs/taro'
import {View, ScrollView, Button} from '@tarojs/components'
import Logger from './../../utils/logger'
import Listen from "../../utils/listen"
import {apiHub} from './../../apis/ApiHub'
import '@tarojs/async-await'
import {IHoleVO, IHole} from './../../apis/HoleApi'
import HoleBar from './../../components/HoleBar/HoleBar'

import './holes.less'

interface IState {
  holeVOList: IHoleVO[],
  settingHoleIndex: number
}

/**
 * @author 张李承
 * @create 2019/4/22 23:27
 * TODO 树洞列表页面 第一次迭代要求实现
 * TODO 树洞 API 修改 mock 用于测试
 * TODO 获取时加载动画 复用于获取报告信息
 * TODO 新建 删除 更新（名称 头像）
 */
export class Holes extends Component<any, IState> {

  private logger = Logger.getLogger(Holes.name);

  config: Config = {
    navigationBarTitleText: '倾诉树洞'
  };

  constructor(props) {
    super(props);
    let holeVOList:IHoleVO[] = [];
    for (let i = 0; i < 10; i++) {
      holeVOList.push({
        _id: i,
        _openid: '' + i,
        createTime: new Date(),
        title: `树洞 ${i} 号`,
        avatarUrl: ''
      });
    }
    this.state = {
      holeVOList,
      settingHoleIndex: -1
    }
  }


  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  private createHole = () => {
    this.logger.info('创建新的树洞！');
    // TODO 调用数据库
    let i = this.state.holeVOList.length;
    let newHole:IHoleVO = {
      _id: i,
      _openid: '' + i,
      createTime: new Date(),
      title: `树洞 ${i} 号`,
      avatarUrl: ''
    };
    this.setState((prev) => {
      return {holeVOList: [newHole, ...prev.holeVOList]};
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
          // TODO 调用 api
          this.setState((prev) => {
            return {holeVOList: prev.holeVOList.splice(idx, 1)};
          });
        }
      })
      .catch((reason) => this.logger.error(reason));
  };

  private holeStartSetHandler = (idx) => {
    this.logger.info('hole start set', idx);
    this.setState(function (prev) {return {...prev, settingHoleIndex: idx};});
  };

  private holeStopSetHandler = () => {
    this.logger.info('hole stop set');
    this.setState(function (prev) {return {...prev, settingHoleIndex: -1};});
  };

  private holeClickHandler = (idx) => {
    this.logger.info('hole click', idx);
  };

  private checkInfoHandler = (idx) => {
    this.logger.info('hole start updating', idx);
  };

  private coverClickHandler = () => {
    this.logger.info('cover click');
    this.setState({settingHoleIndex: -1});

  };

  render() {
    this.logger.info(this.state);

    let holes = this.state.holeVOList.map((hole, idx) =>
      <HoleBar key={idx}
               holeAvatarSrc={hole.avatarUrl}
               holeTitle={hole.title}
               isSetting={this.state.settingHoleIndex === idx}
               onCheckInfo={() => this.checkInfoHandler(idx)}
               onScrollToRight={this.holeStopSetHandler}
               onDelete={() => this.holeDeleteHandler(idx)}
               onScrollToLeft={() => this.holeStartSetHandler(idx)}
               onClick={() => this.holeClickHandler(idx)}
      />
    );

    let buttonHeight = 45;

    return (
      <View>
        {
          this.state.settingHoleIndex >= 0
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
