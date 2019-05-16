import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './HotWordView.less'

interface IProp {
  mostUsedWords: Array<Array<string | number>>
}

/**
 * 热词 View
 * @author 张李承
 * @create 2019/5/16 9:59
 */
export default class HotWordView extends Component<IProp> {

  private wordCloudSetting = [
    [],
    [{width: '700rpx', height: '500rpx'}],
    [
      {width: '600rpx', height: '300rpx', left: '125rpx', top: '350rpx'},
      {width: '400rpx', height: '200rpx'}
    ],
    [
      {width: '400rpx', height: '500rpx', left: '325rpx'},
      {width: '300rpx', height: '300rpx', top: '350rpx'},
      {width: '300rpx', height: '200rpx'}
    ],
    [
      {width: '400rpx', height: '400rpx', left: '325rpx', top: '250rpx'},
      {width: '300rpx', height: '300rpx', top: '350rpx'},
      {width: '300rpx', height: '100rpx', left: '325rpx'},
      {width: '200rpx', height: '200rpx', left: '125rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '400rpx'},
      {width: '100rpx', height: '400rpx', left: '625rpx', top: '250rpx'},
      {width: '600rpx', height: '100rpx', top: '550rpx'},
      {width: '500rpx', height: '100rpx', left: '225rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '400rpx', top: '250rpx'},
      {width: '500rpx', height: '100rpx', left: '225rpx', top: '550rpx'},
      {width: '400rpx', height: '100rpx', left: '325rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'},
      {width: '300rpx', height: '100rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '300rpx', top: '250rpx'},
      {width: '400rpx', height: '100rpx', left: '325rpx', top: '550rpx'},
      {width: '400rpx', height: '100rpx', left: '325rpx'},
      {width: '300rpx', height: '100rpx', top: '550rpx'},
      {width: '300rpx', height: '100rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '300rpx', top: '250rpx'},
      {width: '400rpx', height: '100rpx', left: '325rpx', top: '550rpx'},
      {width: '300rpx', height: '100rpx', left: '225rpx'},
      {width: '300rpx', height: '100rpx', top: '550rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx'},
      {width: '200rpx', height: '100rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '300rpx', top: '250rpx'},
      {width: '300rpx', height: '100rpx', left: '225rpx', top: '550rpx'},
      {width: '300rpx', height: '100rpx', left: '225rpx'},
      {width: '200rpx', height: '100rpx', top: '550rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx', top: '550rpx'},
      {width: '200rpx', height: '100rpx'}
    ],
    [
      {width: '400rpx', height: '300rpx', left: '225rpx', top: '250rpx'},
      {width: '200rpx', height: '300rpx', top: '250rpx'},
      {width: '300rpx', height: '100rpx', left: '225rpx', top: '550rpx'},
      {width: '100rpx', height: '300rpx', left: '625rpx', top: '250rpx'},
      {width: '200rpx', height: '100rpx', top: '550rpx'},
      {width: '200rpx', height: '100rpx', left: '325rpx'},
      {width: '200rpx', height: '100rpx', left: '125rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx', top: '550rpx'},
      {width: '200rpx', height: '100rpx', left: '525rpx'},
      {width: '100rpx', height: '100rpx'}
    ]
  ];

  private createHotTextStyleSetting = (originSetting, word) => {
    let length = word.length;
    let width = this.getNumberBeforeRpx(originSetting.width);
    let height = this.getNumberBeforeRpx(originSetting.height);

    let large;
    let small;
    let lineCount;
    let showWord;
    if (width < height) {
      large = height;
      small = width;
      lineCount = length;
      showWord = word.split('').join('\n');
    } else {
      large = width;
      small = height;
      lineCount = 1;
      showWord = word;
    }

    return {
      style: {
        ...originSetting,
        lineHeight: `${(height / lineCount) >>> 0}rpx`,
        fontSize: `${Math.min((large / length) >>> 0, small)}rpx`
      },
      showWord
    };
  };

  private getNumberBeforeRpx = (item) => {
    return Number(item.substring(0, item.indexOf('rpx')));
  };

  render() {
    let view;

    if (this.props.mostUsedWords) {
      let wordCount = this.props.mostUsedWords.length;

      view = (
        <View className={'hot-word-view'}>
          {this.props.mostUsedWords.map((config, idx) => {
            let word = config[0];
            let originSetting = this.wordCloudSetting[wordCount][idx];
            let setting = this.createHotTextStyleSetting(originSetting, word);
            return (
              <Text key={`hot-word-${idx}`}
                    className={`hot-word`}
                    style={setting.style}
              >
                {setting.showWord}
              </Text>
            )
          })}
        </View>
      )
    }

    return view;
  }
}
