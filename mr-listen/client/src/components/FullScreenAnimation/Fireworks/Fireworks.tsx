import "./Fireworks.less";

import {Block, View} from "@tarojs/components";

import Taro from "@tarojs/taro";
import "@tarojs/async-await";

// interface IProp {
//   content: string
// }
interface IPosition {
  // 以左下角为原点
  x: string,
  y: string
}
export default class Fireworks extends Taro.Component<any, any> {

  // private firstShownGroupPositions: IPosition[];
  // private secondShownGroupPositions: IPosition[];
  // private thirdShownGroupPositions: IPosition[];

  constructor(props) {
    super(props);
    this.initPositions();
  }

  private initPositions() {
    // this.firstShownGroupPositions = [
    //   {x: '10px', y: '80px'},
    //   {x: '100px', y: '20px'},
    //   {x: '225px', y: '120px'},
    //   {x: '365px', y: '40px'},
    // ];
    // this.secondShownGroupPositions = [
    //   {x: '240px', y: '60px'},
    //   {x: '335px', y: '-20px'},
    //   {x: '65px', y: '90px'},
    //   {x: '145px', y: '30px'},
    // ];
    // this.thirdShownGroupPositions = [
    //   {x: '300px', y: '-60px'},
    //   {x: '195px', y: '-180px'},
    //   {x: '25px', y: '-50px'},
    // ];
  }

  render(): any {
    // let content = this.props.content;

    // let firstShownGroup = this.firstShownGroupPositions.map(
    //   (p) => (
    //     <View style={{left: p.x, bottom: p.y}} className={'first-group-emoji'}>
    //       {content}
    //     </View>
    //   )
    // );
    //
    // let secondShownGroup = this.secondShownGroupPositions.map(
    //   (p) => (
    //     <View style={{left: p.x, bottom: p.y}} className={'second-group-emoji'}>
    //       {content}
    //     </View>
    //   )
    // );
    //
    // let thirdShownGroup = this.thirdShownGroupPositions.map(
    //   (p) => (
    //     <View style={{left: p.x, bottom: p.y}} className={'third-group-emoji'}>
    //       {content}
    //     </View>
    //   )
    // );


    return (
      <Block>
        <View className={"outside-shown-box"}>
          <View className={'main-box'}>
            <View className={"liftoff-firework-box"}>
              <View className={'relative-box'}>
                <View className={'liftoff-firework'}/>
                <View className={'liftoff-firework-trace-left'}/>
                <View className={'liftoff-firework-trace-right'}/>
              </View>
            </View>

            {/*<View className={"first-group-box"}>*/}
              {/*<View className={'relative-box'}>*/}
                {/*{firstShownGroup}*/}
              {/*</View>*/}
            {/*</View>*/}
            {/*<View className={"second-group-box"}>*/}
              {/*<View className={'relative-box'}>*/}
                {/*{secondShownGroup}*/}
              {/*</View>*/}
            {/*</View>*/}
            {/*<View className={"third-group-box"}>*/}
              {/*<View className={'relative-box'}>*/}
                {/*{thirdShownGroup}*/}
              {/*</View>*/}
            {/*</View>*/}
          </View>
        </View>
      </Block>
    )
  }
}
