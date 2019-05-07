import "./index.less";
import Taro, {Component, Config} from "@tarojs/taro";
import {View, PickerView, PickerViewColumn, Image, Button, Block, Input} from "@tarojs/components";
import Logger from "../../utils/logger";
import timePng from "../../images/time.png";
import bulbPng from "../../images/bulb.png";
import cancelPng from "../../images/cancel.png";
import userConfig from "../../utils/user-config";
import ShareCanvas from "../../components/ShareCanvas/ShareCanvas";
import Listen from "../../utils/listen";

interface IState {
  // saveTime: number,
  selectedSaveTimeIndex: number,
  qrCode: boolean,
  userInfoGot: boolean,
  inputText: string,
  holeId: string
}

export default class Index extends Component<any, IState> {

  private logger = Logger.getLogger("share");

  config: Config = {
    navigationBarTitleText: "分享"
  };

  constructor(props) {
    super(props);
    this.logger.info(this.$router);
    const holdId = this.$router.params.holeId;
    if (!holdId) {
      Taro.navigateBack()
        .then(() => {
          Listen.message.info("没有任何倾诉哦");
        });
    }
    this.state = {
      // saveTime: this.saveTimes[0].value,
      selectedSaveTimeIndex: 0,
      qrCode: false,
      userInfoGot: false,
      inputText: "",
      holeId: holdId
    };
  }

  private saveTimes = [
    {
      label: "3小时",
      value: 3 * 60 * 60 * 1000
    },
    {
      label: "12小时",
      value: 12 * 60 * 60 * 1000
    },
    {
      label: "1天",
      value: 24 * 60 * 60 * 1000
    },
    {
      label: "3天",
      value: 7 * 24 * 60 * 60 * 1000
    },
  ];


  handleChangePickerTime = (e) => {
    // this.logger.info(e);
    const valueIndex = e.detail.value[0];
    this.setState({
      selectedSaveTimeIndex: valueIndex
    });
  };


  handleClickShare = () => {
    if (this.state.inputText.length > 15) {
      Listen.message.error("个性签名有误");
      return;
    }
    this.logger.info("开始请求服务器，生成二维码");
    this.setState({
      qrCode: true
    })
  };


  handleClickCancel = () => {
    this.setState({
      qrCode: false
    });
  };

  handleGetUserInfo = (res) => {
    this.logger.info(res);
    const userInfo = res.detail.userInfo;
    userConfig.setConfig(userInfo);
    this.setState({userInfoGot: true});
  };


  handleInputChange = (e) => {
    this.setState({
      inputText: e.detail.value
    });
  };

  render(): any {
    const {selectedSaveTimeIndex, qrCode, userInfoGot, inputText, holeId} = this.state;
    const expireIn = this.saveTimes[selectedSaveTimeIndex].value;

    const saveTimeSection = (
      <Block>
        <View className={"share-save-time-wrapper"}>
          <View className={"share-title"}>
            <Image src={timePng} className={"share-icon"}/>
            保质期
          </View>
          <PickerView value={[selectedSaveTimeIndex]} className={"share-picker-view"}
                      indicatorClass={"share-picker-indicator"} onChange={this.handleChangePickerTime}>
            <PickerViewColumn>
              {this.saveTimes.map(item => (
                <View key={item.label} className={"share-picker-item"}>{item.label}</View>
              ))}
            </PickerViewColumn>
          </PickerView>
        </View>

        <View className={"share-save-time-wrapper"}>
          <View className={"share-title"}>
            <Image src={bulbPng} className={"share-icon"}/>
            个性签名
          </View>
          <View>
            <Input
              className={"share-input" + (inputText.length > 15 ? " share-input-error" : "")}
              placeholder={"不超过15字(可留空)"}
              value={inputText}
              onInput={this.handleInputChange}/>
          </View>
        </View>

        {userInfoGot
          ? (
            <View>
              <Button className={"share-btn"} hoverClass={"share-btn-hover"}
                      onClick={this.handleClickShare}>开始制作分享</Button>
              {/*<Button type={"primary"} onClick={this.handleClickShare}>开始制作分享</Button>*/}
            </View>
          )
          : (
            <View>
              <Button className={"share-btn"} openType={"getUserInfo"}
                      onGetUserInfo={this.handleGetUserInfo}>授权使用用户头像及昵称</Button>
            </View>
          )}


      </Block>
    );

    const qrCodeSection = (
      <View className={"share-code-wrapper"}>
        <ShareCanvas text={inputText} holeId={holeId} expireIn={expireIn} onError={this.handleClickCancel}/>
        <Image className={"share-cancel-icon"} src={cancelPng} onClick={this.handleClickCancel}/>
      </View>
    );

    return (
      <View className={"page share-container"}>
        {saveTimeSection}
        {qrCode ? qrCodeSection : null}
      </View>
    );
  }
}
