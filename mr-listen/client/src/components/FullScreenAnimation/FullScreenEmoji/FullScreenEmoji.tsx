import "./FullScreenEmoji.less";

import {Block, View} from "@tarojs/components";

import Taro from "@tarojs/taro";
import "@tarojs/async-await";
import keyboardBehaviorPublisher, {KeyboardBehaviorTypes} from "../../../utils/keyboard-behavior-publisher";

interface IProp {
  content: string
}

interface IState {
  keyboardHeight: string;
}

interface IPosition {
  // 以左下角为原点
  x: string,
  y: string
}

export default class FullScreenEmoji extends Taro.Component<IProp, IState> {

  private firstShownGroupPositions: IPosition[];
  private secondShownGroupPositions: IPosition[];
  private thirdShownGroupPositions: IPosition[];

  constructor(props) {
    super(props);
    this.state = {keyboardHeight: '0px'};
    this.initPositions();
    keyboardBehaviorPublisher.subscribe(KeyboardBehaviorTypes.POP, (res) => {
      this.setState({keyboardHeight: res + 'px'});
      console.log('height: ' + this.state.keyboardHeight)
    });
    keyboardBehaviorPublisher.subscribe(KeyboardBehaviorTypes.HIDE, (res) => {
      this.setState({keyboardHeight: res + 'px'});
    })
  }

  private initPositions() {
    this.firstShownGroupPositions = [
      {x: '10px', y: '3vh'},
      {x: '100px', y: '-6vh'},
      {x: '225px', y: '9vh'},
      {x: '365px', y: '-1vh'},
    ];
    this.secondShownGroupPositions = [
      {x: '240px', y: '1vh'},
      {x: '335px', y: '-2vh'},
      {x: '65px', y: '4vh'},
      {x: '145px', y: '-5vh'},
    ];
    this.thirdShownGroupPositions = [
      {x: '300px', y: '-15vh'},
      {x: '195px', y: '-18vh'},
      {x: '25px', y: '-10vh'},
    ];
  }

  render(): any {
    let content = this.props.content;
    let {keyboardHeight} = this.state;
    console.log('渲染键盘高度' + keyboardHeight);

    let firstShownGroup = this.firstShownGroupPositions.map(
      (p) => (
        <View style={{left: p.x, bottom: `calc( ${p.y} + ${keyboardHeight} )`}} className={'first-group-emoji'}>
          {content}
        </View>
      )
    );

    let secondShownGroup = this.secondShownGroupPositions.map(
      (p) => (
        <View style={{left: p.x, bottom: `calc( ${p.y} + ${keyboardHeight} )`}} className={'second-group-emoji'}>
          {content}
        </View>
      )
    );

    let thirdShownGroup = this.thirdShownGroupPositions.map(
      (p) => (
        <View style={{left: p.x, bottom: `calc( ${p.y} + ${keyboardHeight} )`}} className={'third-group-emoji'}>
          {content}
        </View>
      )
    );


    return (
      <Block>
        <View className={"outside-shown-box"}>
          <View className={"first-group-box"}>
            {firstShownGroup}
          </View>
          <View className={"second-group-box"}>
            {secondShownGroup}
          </View>
          <View className={"third-group-box"}>
            {thirdShownGroup}
          </View>
        </View>
      </Block>
    )
  }
}
