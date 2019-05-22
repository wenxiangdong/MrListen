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

import "../../components/common/animation/FlyInAnimation.less"

interface IState {
  // saveTime: number,
  selectedSaveTimeIndex: number,
  qrCode: boolean,
  inputText: string,
  holeId: string,
  mounted: boolean
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
      inputText: "",
      holeId: holdId,
      mounted: false
    };
  }

  componentDidMount () {
    this.setState({mounted: true})
  }

  private saveTimes = [
    {
      label: "永久",
      value: -1
    },
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
    if (this.state.inputText.length > 10) {
      Listen.message.error("个性签名有误");
      return;
    }
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
    this.handleClickShare();
  };


  handleInputChange = (e) => {
    this.setState({
      inputText: e.detail.value
    });
  };

  render(): any {
    const {selectedSaveTimeIndex, qrCode, inputText, holeId, mounted} = this.state;
    const expireIn = this.saveTimes[selectedSaveTimeIndex].value;

    const saveTimeSection = (
      <Block>
        <View className={`share-save-time-wrapper ${mounted ? `fly-in-1`: ``}`}>
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

        <View className={`share-save-time-wrapper ${mounted ? `fly-in-2`: ``}`}>
          <View className={"share-title"}>
            <Image src={bulbPng} className={"share-icon"}/>
            个性签名
          </View>
          <View>
            <Input
              className={"share-input " + (inputText.length > 10 ? " share-input-error" : "") + " " + (qrCode ? "transparent": "")}
              placeholder={"不超过10字（可选）"}
              value={inputText}
              onInput={this.handleInputChange}/>
          </View>
        </View>

        <View className={`${mounted ? `fly-in-3`: ``}`}>
          <Button className={"share-btn"} openType="getUserInfo" onGetUserInfo={this.handleGetUserInfo}>生成链接图片</Button>
        </View>

        {/*{userInfoGot*/}
          {/*? (*/}
            {/*<View>*/}
              {/*<Button className={"share-btn"} hoverClass={"share-btn-hover"}*/}
                      {/*onClick={this.handleClickShare}>开始制作分享</Button>*/}
              {/*/!*<Button type={"primary"} onClick={this.handleClickShare}>开始制作分享</Button>*!/*/}
            {/*</View>*/}
          {/*)*/}
          {/*: (*/}
            {/*<View>*/}
              {/*<Button className={"share-btn"} openType={"getUserInfo"}*/}
                      {/*onGetUserInfo={this.handleGetUserInfo}>授权使用用户头像及昵称</Button>*/}
            {/*</View>*/}
          {/*)}*/}


      </Block>
    );

    const qrCodeSection = (
      <View className={"share-code-wrapper"}>
        <ShareCanvas text={inputText} holeId={holeId} expireIn={expireIn} onError={this.handleClickCancel}/>
        {/*<Image className={"share-cancel-icon"} src={cancelPng} onClick={this.handleClickCancel}/>*/}
        <View className={"SC-btn"} onClick={this.handleClickCancel}>
          取消
        </View>
      </View>
    );

    return (
      <View className={"page share-container"}>
        {saveTimeSection}
        {qrCode ? (<View className={"share-code-scroll"}>{qrCodeSection}</View>) : null}
      </View>
    );
  }
}
