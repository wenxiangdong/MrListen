import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import AppAvatar from './../../../components/common/AppAvatar/AppAvatar'
import PrivacyPolicyView from './../../../components/personal/PrivacyPolicyView/PrivacyPolicyView'

import './about.less'

interface IState {
  showPrivacyPolicy: boolean
}

/**
 * 关于我们
 * @author 张李承
 * @create 2019/5/2 22:13
 */
export class About extends Component<any, IState> {

  config: Config = {
    navigationBarTitleText: '关于我们'
  };

  private handlePrivacyPolicyTextClick = (e) => {
    e.stopPropagation();
    this.setState({showPrivacyPolicy: true});
  };

  render() {
    let privacyPolicyView = this.state.showPrivacyPolicy
      ? (<PrivacyPolicyView onPrivacyPolicyReturn={
        () => {
          this.setState({showPrivacyPolicy: false});
        }
      }/>)
      : null
    ;

    return (
      <View className={'base-view'}>
        {privacyPolicyView}
        <View className={'app-info-view'}>
          <AppAvatar size={100} margin={20}/>
          <Text className={'name-text'} decode>Mr&nbsp;Listen</Text>
          <Text className={'intro-text'} decode>倾&nbsp;听&nbsp;你&nbsp;的&nbsp;一&nbsp;切</Text>
        </View>
        <View className={'email-view'}>
          <Text>
            <Text decode>mr_listen@126.com&nbsp;|&nbsp;</Text>
          </Text>
          <View className={'privacy-policy-text-view'}>
            <Text onClick={this.handlePrivacyPolicyTextClick}>隐私策略</Text>
          </View>
        </View>
      </View>
    );
  }
}
