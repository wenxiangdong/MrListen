import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'

import './PageTwo.less'
import './../Report.less'

import paperPlanePNG from './paper-plane.png'

interface IProp {
  meetTime: number
}

interface IState {
  mounted: boolean
}

/**
 * 报告页面第二页
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageTwo extends Component<IProp, IState> {

  constructor(props) {
    super(props);

    this.state = {mounted: false};
  }

  private getHourTexts = (hour) => {
    let texts = ['', ''];

    if (hour < 4 || hour > 22) {
      if (hour < 4) {
        texts[0] = `清晨的 ${hour} 点我们相遇`;
      } else {
        texts[0] = `深夜里的 ${hour} 点我们相遇`;
      }
      texts[1] = `之后每个睡不着的夜里都会有我陪你`;
    } else if (hour < 8) {
      texts[0] = `清晨`;
      texts[1] = `我们相约遇见 ${hour} 点的太阳`;
    } else if (hour < 12) {
      texts[0] = `早晨 ${hour} 点`;
      texts[1] = `道过早安，又是充实的一天`;
    } else if (hour < 14) {
      texts[0] = `中午的 ${hour - 12} 点`;
      texts[1] = `午饭后记得小憩一会儿喔`;
    } else if (hour < 17) {
      texts[0] = `下午的 ${hour - 12} 点`;
      texts[1] = `道过午安，等太阳落山`;
    } else if (hour < 19) {
      texts[0] = `傍晚的 ${hour - 12} 点`;
      texts[1] = `黄昏时的暖风轻轻地吹，一天快要过去了`;
    } else {
      texts[0] = `夜晚的 ${hour - 12} 点`;
      texts[1] = `记得要早点休息，晚安`;
    }

    return texts;
  };

  componentDidMount () {
    setTimeout(() => {
      this.setState({mounted: true});
    }, 200)
  }

  render() {
    let meetDate = new Date(this.props.meetTime);
    let texts = this.getHourTexts(meetDate.getHours());
    const {mounted} = this.state;

    return (
      <View className={'base-style page-2'}>
        <View className={'box'}>
          <View className={'first-block'}>
            <View className={'align-text'}>
              <View className={`text-align-last word-1 ${mounted ? `word-fly-in-1` : ``}`}>还记得</View>
              <View className={`text-align-last word-2 ${mounted ? `word-fly-in-3` : ``}`}>我们的初次相遇</View>
              <View className={`text-align-last word-3  ${mounted ? `word-fly-in-6` : ``}`}>
                <Text decode>那是在&nbsp;</Text>
                <Text className={'strong'} decode>
                  {meetDate.getFullYear()}&nbsp;年的
                  &nbsp;{meetDate.getMonth() + 1}&nbsp;月
                </Text>
              </View>
            </View>
          </View>
          <View className={'second-block'}>
            <View>
              <View className={'word-4 ${mounted ? `word-fly-in-9` : ``} strong'}>{texts[0]}</View>
              <View className={'word-5 ${mounted ? `word-fly-in-12` : ``}'}>{texts[1]}</View>
            </View>
          </View>
        </View>
        <View className={'paper-plane'}>
          <Image className={'paper-plane-img'} src={paperPlanePNG}/>
        </View>
      </View>
    )
  }
}
