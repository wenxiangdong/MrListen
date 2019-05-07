import Taro, {Component, Config} from '@tarojs/taro'
import {View, Input, Button} from '@tarojs/components'

import Avatar from './../../../components/ChatBubble/Avatar'

import Logger from './../../../utils/logger'
import Listen from '../../../utils/listen'
import {apiHub} from '../../../apis/ApiHub'
import {IHoleVO} from '../../../apis/HoleApi'

import './../../../components/common/common-zlc.less'
import './update.less'

interface IState {
  avatarUrl: string,
  title: string
}

/**
 * 更新树洞信息页面
 * @author 张李承
 * @create 2019/5/5 19:06
 * TODO 可以进行美化
 * TODO 在树洞 title 的 input 后面加个 icon
 */
export class Update extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '修改树洞'
  };

  private hole: IHoleVO;

  private logger = Logger.getLogger(Update.name);

  constructor(props) {
    super(props);
    if (this.$router.params.hole) {
      this.hole = JSON.parse(this.$router.params.hole);
      this.state = {
        avatarUrl: this.hole.avatarUrl,
        title: this.hole.title
      }
    } else {
      Taro.navigateBack()
        .then(() => {
          Listen.message.error('出错了');
        })
        .catch((e) => {
          this.logger.error(e);
          Listen.message.error('跳转失败');
        })
    }
  }

  private handleAvatarClick = () => {
    // 先选择图片
    Listen.showLoading('上传中');
    Taro.chooseImage({count: 1})
      .then(res => {
        this.logger.info(res);
        const {tempFilePaths = []} = res || {};
        // 触发事件
        this.setState({avatarUrl: tempFilePaths[0]});
        Listen.hideLoading();
      })
      .catch(e => {
        const {errMsg = ''} = e;
        this.logger.error(e);
        Listen.hideLoading();
        // 是不是取消了
        if (!errMsg.includes('cancel')) {
          Listen.message.error('请重新选择图片');
        }
      })
  };

  private handleSaveChange = () => {
    Listen.showLoading('保存中');
    apiHub.holeApi.updateHole(this.hole._id, {...this.hole, avatarUrl: this.state.avatarUrl, title: this.state.title})
      .then(() => {
        Listen.hideLoading();
        Listen.message.success('保存修改成功');
      })
      .catch((e) => {
        this.logger.error(e);
        Listen.hideLoading();
        Listen.message.error('保存失败');
      })
  };

  render() {
    return (
      <View className={'flex-column-start-center'}>
        <View className={'flex-column-center vw-rect'}>
          <Avatar src={this.state.avatarUrl} size={100} margin={20}/>
          <Button type={'primary'} plain={true} size={'mini'} onClick={this.handleAvatarClick}>修改头像</Button>
        </View>
        <Input className={'hole-title-input'} type={'text'} value={this.state.title}/>
        <Button className={'save-change-button'} type={'primary'} onClick={this.handleSaveChange}>保存修改</Button>
      </View>
    )
  }
}
