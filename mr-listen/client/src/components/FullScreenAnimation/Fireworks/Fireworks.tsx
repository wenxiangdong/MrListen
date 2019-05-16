import "./Fireworks.less";

import {Block, View} from "@tarojs/components";

import Taro from "@tarojs/taro";
import "@tarojs/async-await";

export default class Fireworks extends Taro.Component<any, any> {

  constructor(props) {
    super(props);
  }


  render(): any {

    const fifty = [...Array(30).keys()];
    const shortGroup = fifty.map((number) => {
      return <View key={String(number)}
                   style={{
                     transform: `rotate(${Math.round(Math.random() * 360)}deg) scale(${(Math.random() + 0.02) * 2})`,
                   }}
                   className={'spark-box'}>
        <View className={'spark short-trace'}/>
      </View>
    });
    const meddleGroup = fifty.map((number) => {
      return <View key={String(number)}
                   style={{
                     transform: `rotate(${Math.round(Math.random() * 360)}deg) scale(${(Math.random()) * 3})`,
                   }}
                   className={'spark-box'}>
        <View className={'spark meddle-trace'}/>
      </View>
    });
    const longGroup = fifty.map((number) => {
      return <View key={String(number)}
                   style={{
                     transform: `rotate(${Math.round(Math.random() * 360)}deg) scale(${(Math.random()) * 3})`,
                   }}
                   className={'spark-box'}>
        <View className={'spark long-trace'}/>
      </View>
    });


    return (
      <Block>
        <View className={"outside-shown-box"}>
          <View className={"liftoff-firework-box"}>
            <View className={'liftoff-firework'}/>
            <View className={'liftoff-firework-trace-left'}/>
            <View className={'liftoff-firework-trace-right'}/>
          </View>

          <View className={"spark-group-box"}>
            {shortGroup}
            {meddleGroup}
            {longGroup}
            {/*<View className={'spark-box'}>*/}
            {/*<View className={'spark short-trace'}/>*/}
            {/*</View>*/}
          </View>
        </View>
      </Block>
    )
  }
}
