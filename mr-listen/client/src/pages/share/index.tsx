import "./index.less";
import Taro, {Component} from "@tarojs/taro";
import {View, PickerView, PickerViewColumn, Image, Button, Block, Text} from "@tarojs/components";
import Logger from "../../utils/logger";
import timePng from "../../images/time.png";
import savePng from "../../images/save.png";
import cancelPng from "../../images/cancel.png";

interface IState {
  // saveTime: number,
  selectedSaveTimeIndex: number,
  qrCode: string
}

export default class Index extends Component<any, IState> {

  private logger = Logger.getLogger("share");

  constructor(props) {
    super(props);
    this.logger.info(this.$router);
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


  state = {
    // saveTime: this.saveTimes[0].value,
    selectedSaveTimeIndex: 0,
    qrCode: ""
  };


  handleChangePickerTime = (e) => {
    // this.logger.info(e);
    const valueIndex = e.detail.value[0];
    this.setState({
      selectedSaveTimeIndex: valueIndex
    });
  };


  handleClickShare = () => {
    this.logger.info("开始请求服务器，生成二维码");
    this.setState({
      qrCode: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557050517098&di=8573453cd7dcc1d45a040d2867d2025e&imgtype=jpg&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D3420366866%2C2755950155%26fm%3D214%26gp%3D0.jpg"
    })
  };


  handleClickCancel = () => {
    this.setState({
      qrCode: ""
    });
  };

  render(): any {
    const {selectedSaveTimeIndex, qrCode} = this.state;

    const saveTimeSection = (
      <Block>
        <View className={"share-save-time-wrapper"}>
          <View className={"share-title"}>
            <Image src={timePng} className={"share-icon"}/>
            保质期
          </View>
          <PickerView value={[selectedSaveTimeIndex]} className={"share-picker-view"} indicatorClass={"share-picker-indicator"} onChange={this.handleChangePickerTime}>
            <PickerViewColumn>
              {this.saveTimes.map(item => (
                <View key={item.label} className={"share-picker-item"}>{item.label}</View>
              ))}
            </PickerViewColumn>
          </PickerView>
        </View>
        <View>
          <Button className={"share-btn"} hoverClass={"share-btn-hover"} onClick={this.handleClickShare}>开始制作分享</Button>
          {/*<Button type={"primary"} onClick={this.handleClickShare}>开始制作分享</Button>*/}
        </View>
      </Block>
    );

    const qrCodeSection = (
      <View className={"share-code-wrapper"}>
        <Image className={"share-code-img share-code-item"} src={qrCode}/>
        <Button className={"share-code-item share-button"}>
          <Image className={"share-icon"} src={savePng}/>
          保存到相册
        </Button>
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
