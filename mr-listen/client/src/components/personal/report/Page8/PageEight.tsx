import Taro, {Component} from '@tarojs/taro'
import {View, Text, OpenData, Button} from '@tarojs/components'

import './PageEight.less'
import './../Report.less'
import AppAvatar from "../../../common/AppAvatar/AppAvatar";

interface IProp {
  onReturnTopClick: () => void
}

/**
 * 报告页面第八页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageEight extends Component<IProp> {

  render() {
    return (
      <View>
        <View>
          <Text>Hi</Text>
          <OpenData type={'userNickName'}/>
          <Text>:</Text>
        </View>
        <View>
          <Text>不管是过去还是未来</Text>
          <Text>只要是你想说的</Text>
          <Text>都会认真倾听</Text>
          <Text>祝 天天开心</Text>
          <View>
            <AppAvatar size={40} margin={10}/>
            <View className={'app-info-vertical-separator'}/>
            <View>
              <Text>Mr Listen</Text>
              <Text>倾 听 你 的 一 切</Text>
            </View>
          </View>
        </View>
        <View>
          <Button
            plain={true}
            onClick={this.props.onReturnTopClick}>回放报告</Button>
        </View>
      </View>
    );
  }
}
