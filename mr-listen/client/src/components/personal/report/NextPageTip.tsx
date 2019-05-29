import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./Report.less"

interface IProp {
  bottom?: string,
  flyInTime: string
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
    const {bottom, flyInTime} = this.props;

    const {mounted} = this.state;

    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDay();

    if (day === 1) {
      month--;
    }

    return (
      <View className={`tip ${mounted ? `word-fly-in-${flyInTime}` : ``}`} style={{bottom: bottom}}>
        <View className={`tip-data-date`}>*本次报告数据来源截止至 {year} 年 {month} 月 1 号</View>
        点击进入下一页
      </View>
    );
  }

}
