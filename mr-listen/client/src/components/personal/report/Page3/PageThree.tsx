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
            <View>
              <Text className={`word-3 strong ${mounted ? `word-fly-in-5` : ``}`}>{this.props.holeCount}</Text>
              <Text className={`word-4 ${mounted ? `word-fly-in-5` : ``}`}>个树洞</Text>
            </View>
            <View className={`word-5 ${mounted ? `word-fly-in-8` : ``}`}>你来过，就一直是我的牵挂</View>
          </View>
        </View>
      )
      : (
        <View className={'box'}>
          <View>
            <View className={`align-text`}>
              <View className={`text-align-last word-6 ${mounted ? `word-fly-in-1` : ``}`}>你还没有发过任何消息</View>
              <View className={`text-align-last word-7 strong ${mounted ? `word-fly-in-3` : ``}`}>不过没关系</View>
              <View className={`text-align-last word-8 ${mounted ? `word-fly-in-5` : ``}`}>接下来的日子里</View>
              <View className={`text-align-last word-9 ${mounted ? `word-fly-in-7` : ``}`}>还有好多树洞等着被故事填满</View>
            </View>
          </View>
        </View>
      );

    return (
      <View className={'base-style page-3'}>
        {reportInfo}
        <View className={'roll-area'}>
          <View className={'roll delay-1'}>😡</View>
          <View className={'roll delay-2'}>🙃</View>
          <View className={'roll delay-3'}>🤒</View>
          <View className={'roll delay-4'}>🤩</View>
          <View className={'roll delay-5'}>🧐</View>
          <View className={'roll delay-6'}>😙</View>
          <View className={'roll delay-7'}>🤕</View>
        </View>
      </View>
    );
  }
}
