import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './PageSix.less'
import './../Report.less'
import NextPageTip from "../NextPageTip/NextPageTip";

interface IProp {
  shareHoleCount: number,
  plusOneCount: number
}


interface IState {
  mounted: boolean
}

/**
 * 报告页面第六页
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageSix extends Component<IProp, IState> {

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
    let shareHoleCount = this.props.shareHoleCount;
    let plusOneCount = this.props.plusOneCount;

    let reportInfo = shareHoleCount
      ? (
        <View>
          <View className={'first-block'}>
            <View className={`align-text`}>
              <View className={`text-align-last word-1 ${mounted ? `word-fly-in-1` : ``}`}>你喜欢分享，已经有</View>
              <View className={`word-2 ${mounted ? `word-fly-in-3` : ``}`}>
                <Text className={'strong word-num'}>{shareHoleCount}</Text>
                <Text>次</Text>
              </View>
              <View className={`text-align-last word-3 ${mounted ? `word-fly-in-5` : ``}`}>分享树洞的经历</View>
              </View>
            {
              plusOneCount > 0 ?
                <View className={`text-align-last word-4 ${mounted ? `word-fly-in-8` : ``}`}>
                  <Text>你也在这其中收获了</Text>
                  <Text>{plusOneCount}</Text>
                  <Text>次点赞</Text>
                </View>
                :
                <View></View>
            }
          </View>
          <NextPageTip flyInTime={"10"}/>
        </View>
      )
      : (
        <View className={`align-text none-block`}>
          <View className={`text-align-last word-5 ${mounted ? `word-fly-in-1` : ``}`}>你还没有跟别人分享过树洞</View>
          <View className={`strong text-align-last word-6 ${mounted ? `word-fly-in-3` : ``}`}>这些都是我们的小秘密</View>
          <NextPageTip flyInTime={"5"}/>
        </View>
      )
    ;

    return (
      <View className={'base-style page-6'}>
        <View className={'box'}>
          {reportInfo}
        </View>
      </View>
    );
  }
}
