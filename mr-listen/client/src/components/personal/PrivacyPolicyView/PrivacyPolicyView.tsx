import Taro, {Component} from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'

import './PrivacyPolicyView.less'

interface IProp {
  onPrivacyPolicyReturn: () => void
}

/**
 * 隐私策略组件
 * @author 张李承
 * @create 2019/5/18 17:06
 * TODO 美化
 */
export default class PrivacyPolicyView extends Component<IProp> {

  private privacyPolicyText = [
    'Mr Listen 隐私协议',
    'Mr Listen 尊重和保护用户的隐私，本协议将告诉您我们如何收集和使用有关您的信息。',
    '一、用户信息的收集',
    '为了不影响您的使用体验，我们保持大部分的功能都可以在不提供信息授权的情况下正常使用。',
    '在制作分享海报时，我们会请求提供您的用户昵称用于海报生成，该信息仅用于生成您的分享报告，我们并不会记录您的信息。',
    '除此之外您在程序的其他地方所看到的您的用户信息，均属于仅用于展示的公开信息，并不会被我们采集，请不用担心。',
    '二、关于倾诉信息',
    '我们不会主动查看和修改您的倾诉记录和信息。',
    '我们不会主动向第三方提供您的数据。',
    '您的倾诉数据仅会用于您的倾诉分享，和被用于生成您的倾诉报告。'
  ];

  private handlePrivacyPolicyReturn = (e) => {
    e.stopPropagation();
    this.props.onPrivacyPolicyReturn();
  };

  render() {
    return (
      <View className={'privacy-policy-view'}>
        <View className={'cover'}
              onClick={this.handlePrivacyPolicyReturn} />
        <ScrollView className={'privacy-policy-scroll-view'} scrollY>
          {this.privacyPolicyText.map((text, idx) => {
            let className = (idx == 0
              ? 'main-title'
              : text.match(/.、.+/)
                ? 'sub-title'
                : 'normal-text')
              + ' privacy-policy-text'
            ;
            return <Text className={className} key={`text-${idx}`} decode>{text}\n</Text>;
          })}
        </ScrollView>
      </View>
    )
  }
}
