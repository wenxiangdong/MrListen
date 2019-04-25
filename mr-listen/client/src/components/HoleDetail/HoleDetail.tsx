// Hole的详细组件，包括了输入框和气泡
// 可以参考pages/dev下面的两个文件
import "./HoleDetail.less";
import Taro, { Component } from '@tarojs/taro'
import {View} from "@tarojs/components";
import InputBar from './InputBar/InputBar';
import { Bubble } from '../../apis/BubbleApi';
import Logger from '../../utils/logger';
import { BubbleVO } from "src/apis/HoleApi";


interface IState {
    bubbleVOList: BubbleVO[]
}
export default class HoleDetail extends Component<any, IState> {

    private logger = Logger.getLogger(HoleDetail.name);

    render() {
        return (
            <View className={'main-box'}>
                <View className={'bubble-area'}>
                </View>
                <InputBar onBubbling={this.handleBubbling} input-bar-class={'input-bar'}/>
            </View>
        );
    }

    handleBubbling = (bubble: Bubble) => {
        this.logger.info(bubble);
        
    };


}
