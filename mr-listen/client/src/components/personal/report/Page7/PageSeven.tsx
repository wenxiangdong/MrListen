import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import HotWordView from './HotWordView/HotWordView'

import './PageSeven.less'
import './../Report.less'

interface IProp {
  mostUsedWords: Array<Array<string | number>>
}

/**
 * 报告页面第七页
 * @author 张李承
 * @create 2019/5/14 14:49
 * TODO 未完成
 */
export default class PageSeven extends Component<IProp> {
  render() {
    let reportInfo;
    if (this.props.mostUsedWords) {
      reportInfo =
        this.props.mostUsedWords.length
          ? (
            <View>
              <HotWordView mostUsedWords={this.props.mostUsedWords}/>
              <View>
                <Text>这么多天来</Text>
                <Text>我常常听你说到这些</Text>
              </View>
            </View>
          )
          : (
            <View>
              <Text>你的树洞空空如也</Text>
              <Text>它的主人神神秘秘</Text>
            </View>
          )
      ;
    }

    return (
      <View>
        {reportInfo}
      </View>
    );
  }
}
