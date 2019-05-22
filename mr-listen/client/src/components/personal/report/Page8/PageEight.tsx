import Taro, {Component} from '@tarojs/taro'
import {View, Text, OpenData, Button} from '@tarojs/components'

import './PageEight.less'
import './../Report.less'
import AppAvatar from "../../../common/AppAvatar/AppAvatar";

interface IProp {
  onReturnTopClick: () => void
}

interface IState {
  mounted: boolean
}

/**
 * 报告页面第八页
 * @author 张李承
 * @create 2019/5/14 14:49
 */
export default class PageEight extends Component<IProp, IState> {
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

    return (
      <View className={'base-style page-8'}>
        <View className={'box'}>
          {/*<View className={`word-1 ${mounted ? `word-fly-in-1` : ``}`}>*/}
          {/*<Text>Hi，</Text>*/}
          {/*<OpenData type={'userNickName'} className={'username'}/>*/}
          {/*<Text>:</Text>*/}
          {/*</View>*/}
          <View className={'align-text'}>
            <View className={`text-align-last word-1 ${mounted ? `word-fly-in-3` : ``}`}>(todo)文案应该要改一下XD</View>
            <View className={`text-align-last word-2 ${mounted ? `word-fly-in-5` : ``}`}>孤单、悲伤、愤怒或者开心</View>
            <View className={`word-3 strong ${mounted ? `word-fly-in-8` : ``}`}>
              我们都可以一起渡过
            </View>
          </View>
          <View>
            <AppAvatar size={40} margin={10}/>
            <View className={'app-info-vertical-separator'}/>
            {/*<View>*/}
              {/*<Text>Mr Listen</Text>*/}
              {/*<Text>倾 听 你 的 一 切</Text>*/}
            {/*</View>*/}
          </View>
          <View>
            <Button
              plain={true}
              onClick={this.props.onReturnTopClick}>回放报告</Button>
          </View>
        </View>
      </View>
    );
  }
}
