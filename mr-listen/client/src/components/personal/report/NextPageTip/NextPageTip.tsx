import Taro from "@tarojs/taro";
import {View, Text} from "@tarojs/components";

import "./NextPageTip.less"
import "./../Report.less"

interface IProp {
  bottom?: string,
  top?: string,
  flyInTime: string,
  showDate?: boolean
}

interface IState {
  mounted: boolean
}

export default class NextPageTip extends Taro.Component<IProp, IState> {

  constructor(props) {
    super(props);

    this.state = {mounted: false};
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({mounted: true})
    }, 200)
  }

  render () {
    const {bottom, top, flyInTime, showDate} = this.props;

    const {mounted} = this.state;

    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDay();

    if (day === 1) {
      month--;
    }

    let baseViewStyle = top
      ? {top}
      : (
        bottom
          ? {bottom}
          : {}
          )
    ;

    return (
      <View className={`tip ${mounted ? `word-fly-in-${flyInTime}` : ``}`} style={baseViewStyle}>
        <Text>
          点击进入下一页
        </Text>
        {
          showDate
            ? (
              <View className={`tip-data-date`}>
                <Text decode>
                  *本次报告数据来源截止至&nbsp;{year}&nbsp;年&nbsp;{month}&nbsp;月
                </Text>
              </View>
            )
            : null
        }
      </View>
    );
  }

}
