import Taro, {Component} from "@tarojs/taro";
import {View, Textarea, Button, Text} from "@tarojs/components";
import Logger from "../../../utils/logger";
import "./InputModal.less";


interface  IProp {
  title: string,
  visible: boolean,
  onConfirm: (value: string) => void,
  onHide: () => void
}
export default class InputModal extends Component<IProp> {

  private logger = Logger.getLogger(InputModal.name);

  state = {
    text: ""
  };

  componentDidMount(): void {
    this.logger.info("modal");
  }


  handleInput = (e) => {
    this.logger.info(e);
    this.setState({
      text: e.detail.value
    });
  };

  handleClickOk = () => {
    const {onConfirm} = this.props;
    const {text} = this.state;
    if (typeof onConfirm === "function") {
      onConfirm(text);
    }
    this.setState({text: ""});
  };

  handleClickHide = () => {
    this.setState({text: ""});
    const {onHide} = this.props;
    if (typeof onHide === "function") {
      onHide();
    }
  };

  render(): any {
    const {text} = this.state;
    const {title, visible} = this.props;
    this.logger.info("props", title, visible);
    return visible ? (
      <View className={"IM-wrapper"}>
        <View className={"IM-main"} onClick={e => e.stopPropagation()}>
          <Text className={"IM-title"}>{title}</Text>
          <Textarea value={text} className={"IM-textarea"} autoHeight={true} onInput={this.handleInput} />
          <View className={"IM-button-wrapper"}>
            <Button className={"IM-button"} type={"primary"} onClick={this.handleClickOk}>完成</Button>
            <Button className={"IM-button"} onClick={this.handleClickHide}>取消</Button>
          </View>
        </View>
      </View>
    ) : null;
  }
}
