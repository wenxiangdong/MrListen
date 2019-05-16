import "./FullScreenEmoji.less";

import {Block, View} from "@tarojs/components";

import Taro from "@tarojs/taro";
import "@tarojs/async-await";

interface IProp {
  content: string
}

interface IPosition {
  // 以左下角为原点
  x: string,
  y: string
}

export default class FullScreenEmoji extends Taro.Component<IProp, any> {

  private firstShownGroupPositions: IPosition[];
  private secondShownGroupPositions: IPosition[];
  private thirdShownGroupPositions: IPosition[];

  constructor(props) {
    super(props);
    this.initPositions();
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

    let firstShownGroup = this.firstShownGroupPositions.map(
      (p) => (
        <View style={{left: p.x, bottom: p.y}} className={'first-group-emoji'}>
          {content}
        </View>
      )
    );

    let secondShownGroup = this.secondShownGroupPositions.map(
      (p) => (
        <View style={{left: p.x, bottom: p.y}} className={'second-group-emoji'}>
          {content}
        </View>
      )
    );

    let thirdShownGroup = this.thirdShownGroupPositions.map(
      (p) => (
        <View style={{left: p.x, bottom: p.y}} className={'third-group-emoji'}>
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
