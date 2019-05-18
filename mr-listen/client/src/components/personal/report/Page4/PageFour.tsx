import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'

import './PageFour.less'
import './../Report.less'
import VoicePNG from './voice.png';

interface IProp {
  longestDuration: number
}

interface IState {
  mounted: boolean
}

/**
 * 报告页面第四页
 * TODO 添加背景图片
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageFour extends Component<IProp, IState> {

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
    let seconds = (this.props.longestDuration / 1000) >>> 0;
    let minutes = (seconds / 60) >>> 0;
    let reportInfo = minutes > 0
      ? (
        <View>
          <View>
            <View className={`align-text`}>
              <View className={`text-align-last word-1 ${mounted ? `word-fly-in-1` : ``}`}>你发过最长的语音消息</View>
              <View className={`text-align-last word-2 ${mounted ? `word-fly-in-3` : ``}`}>
                <Text>唠唠叨叨了{'\n'}</Text>
              </View>
              <View className={`word-3 ${mounted ? `word-fly-in-5` : ``}`}>
                <Text className={'word-num strong'}>{minutes}</Text>
                <Text>分钟</Text>
              </View>
            </View>
            <View className={`word-4 ${mounted ? `word-fly-in-8` : ``}`}>其实我非常喜欢听你讲故事</View>
          </View>
        </View>
      )
      : seconds
        ? (
          <View>
            <View className={`align-text`}>
              <View className={`text-align-last word-1 ${mounted ? `word-fly-in-1` : ``}`}>你发过最长的语音消息</View>
              <View className={`text-align-last word-2 ${mounted ? `word-fly-in-3` : ``}`}>
                <Text>也不过说了{'\n'}</Text>
              </View>
              <View className={`word-3 ${mounted ? `word-fly-in-5` : ``}`}>
                <Text className={'word-num strong'}>{seconds}</Text>
                <Text>秒</Text>
              </View>
            </View>
            <View className={`word-4 ${mounted ? `word-fly-in-8` : ``}`}>我还想多听听你的故事</View>
          </View>
        )
        : (
          <View className={`align-text`}>
            <View className={`text-align-last word-5 ${mounted ? `word-fly-in-1` : ``}`}>你还没有给我发过语音消息</View>
            <View className={`text-align-last strong word-6 ${mounted ? `word-fly-in-3` : ``}`}>我其实很想听你讲故事</View>
          </View>
        )
    ;

    return (
      <View className={'base-style page-4'}>
        <View className={'box'}>
          {reportInfo}
        </View>
        <View className={'voice-animation'}>
          <View className={'bubble-box'}>
            <View className={'bubble'}>
              <Image className={'voice'} src={VoicePNG}/>
              {/*<Text className={'text'}>{Math.round(this.props.longestDuration / 1000) + 's'}</Text>*/}
            </View>
          </View>
          <View className={'music-box'}>
            <View className={'column column-red column-1'}/>
            <View className={'column column-red column-2'}/>
            <View className={'column column-red column-3'}/>
            <View className={'column column-red column-5'}/>
            <View className={'column column-red column-4'}/>
            <View className={'column column-red column-3'}/>
            <View className={'column column-red column-1'}/>
          </View>
        </View>
      </View>
    );
  }
}
