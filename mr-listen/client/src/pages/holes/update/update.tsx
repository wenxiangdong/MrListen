import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'

import Avatar from './../../../components/ChatBubble/Avatar'

import Logger from './../../../utils/logger'
import Listen from '../../../utils/listen'
import {apiHub} from '../../../apis/ApiHub'
import {IHoleVO} from '../../../apis/HoleApi'

import './../../../components/common/common-zlc.less'

interface IState {
  avatarUrl: string
}

/**
 * 更新树洞信息页面
 * @author 张李承
 * @create 2019/5/5 19:06
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
        avatarUrl: this.hole.avatarUrl
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

  render() {
    return (
      <View className={'flex-column-start-center'}>
        <View className={'flex-column-center vw-rect'}>
          <Avatar src={this.state.avatarUrl} size={100} margin={20}/>
          <Button type={'primary'}>修改头像</Button>
        </View>
      </View>
    )
  }
}
