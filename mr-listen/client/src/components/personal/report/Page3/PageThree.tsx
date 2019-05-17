import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './PageThree.less'
import './../Report.less'

interface IProp {
  holeCount: number
}

interface IState {
  mounted: boolean
}

/**
 * 报告页面第三页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageThree extends Component<IProp, IState> {

  constructor(props) {
    super(props);

    this.state = {mounted: false};
  }


  componentDidMount() {
    setTimeout(() => {
      this.setState({mounted: true});
    }, 200)
  }

  render() {
    const {mounted} = this.state;
    let reportInfo = this.props.holeCount
      ? (
        <View className={'box'}>
          {/* 形成一个块元素 */}
          <View>
            <View className={`align-text`}>
              <View className={`text-align-last word-1 ${mounted ? `word-fly-in-1` : ``}`}>这么多天来</View>
              <View className={`text-align-last word-2 ${mounted ? `word-fly-in-3` : ``}`}>你的话语整整填满了</View>
            </View>
            <View className={`word-3 strong ${mounted ? `word-fly-in-5` : ``}`}>{this.props.holeCount}</View>
            <View className={`word-4 ${mounted ? `word-fly-in-6` : ``}`}>个树洞</View>
          </View>
        </View>
      )
      : (
        <View className={'box'}>
          <Text>你还没有倾诉过</Text>
          <Text>不过不用着急 慢慢来就好</Text>
          <Text>还有好多树洞等着被故事填满</Text>
        </View>
      );

    return (
      <View className={'base-style page-3'}>
        {reportInfo}
      </View>
    );
  }
}
