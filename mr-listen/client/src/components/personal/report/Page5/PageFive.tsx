import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'

import './PageFive.less'
import './../Report.less'
import bedPNG from './bed.png'
import moonPNG from './moon.png'
import NextPageTip from "../NextPageTip";

interface IProp {
  latestTime: number
}

interface IState {
  mounted: boolean
}

/**
 * 报告页面第五页
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageFive extends Component<IProp, IState> {

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

    let latestDate = new Date(this.props.latestTime);
    let year = latestDate.getFullYear();
    let month = latestDate.getMonth() + 1;
    let date = latestDate.getDate();
    let hour = latestDate.getHours();
    let dateTime = (hour > 12 ? '深夜' : '凌晨') + ' ';
    hour = hour > 12 ? hour - 12 : hour;
    let minute = latestDate.getMinutes();

    let reportInfo =
      this.props.latestTime
        ? (
          <View>
            <View className={`align-text`}>
              <View className={`text-align-last word-1 ${mounted ? `word-fly-in-1` : ``}`}>我还记得最晚的那一天</View>
              <View className={`text-align-last word-2 ${mounted ? `word-fly-in-4` : ``}`}>
                <Text>
                  那是在
                  <Text decode className={'strong'}>
                    &nbsp;&nbsp;{year}&nbsp;年&nbsp;{month}&nbsp;月&nbsp;{date}&nbsp;日
                  </Text>
                </Text>
              </View>
              <View className={`text-align-last word-3 ${mounted ? `word-fly-in-7` : ``}`}>
                <Text decode className={'strong'}>
                  {dateTime}{hour}&nbsp;点&nbsp;{minute}&nbsp;分
                </Text>
              </View>
            </View>
            <View className={`word-4 ${mounted ? `word-fly-in-10` : ``}`}>还没有睡的你想起了我</View>
            <NextPageTip flyInTime={"12"}/>
          </View>
        )
        : (
          <View>
            <View>
              <View className={`align-text`}>
                <View className={`text-align-last word-5 ${mounted ? `word-fly-in-1` : ``}`}>
                  你还没有在很晚的时候找过我
                </View>
                <View className={`text-align-last word-6 ${mounted ? `word-fly-in-4` : ``}`}>
                  长夜变清早虽然浪漫
                </View>
                <View className={`text-align-last word-7 ${mounted ? `word-fly-in-8` : ``}`}>
                  我还是希望你
                  <Text className={'strong'}>好好休息</Text>
                </View>
              </View>
            </View>
            <NextPageTip flyInTime={"10"}/>
          </View>
        )
    ;

    return (
      <View className={'base-style page-5'}>
        <View className={'box'}>
          {reportInfo}
        </View>
        <View className={'moon-box'}>
          <Image className={'moon'} src={moonPNG}/>
        </View>
        <View className={'bed-box'}>
          <Image className={'bed'} src={bedPNG}/>
        </View>
      </View>
    );
  }
}
