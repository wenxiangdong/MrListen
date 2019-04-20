import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import withHello from "../../decorators/with-hello";
import {apiHub} from "../../apis/ApiHub";

@withHello()
class Login extends Component {
  state = {
    context: {}
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getLogin = () => {
    apiHub.userApi.login();
  };

  render() {
    return (
      <View className='index'>
        <Button onClick={this.getLogin}>获取登录云函数</Button>
        <Text>context：{JSON.stringify(this.state.context)}</Text>
      </View>
    )
  }
}


export default Login;
