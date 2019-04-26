import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'

import './ColorPickerOption.less'

interface IProp {
  color: string,
  selected: boolean,
  onSelect: () => void
}

/**
 * 颜色预选项组件
 * TODO 选中的组件样式优化
 * @author 张李承
 * @create 2019/4/26 15:44
 * TODO 请 cyf 同学进行美化
 */
export default class ColorPickerOption extends Component<IProp, any> {
  private clickHandler = (e) => {
    e.stopPropagation();
    if (!this.props.selected && this.props.onSelect) {
      this.props.onSelect();
    }
  };

  render() {
    let {color} = this.props;

    let viewClassName = 'color-picker-option';
    let hoverClass = 'hover-color-picker-option';
    if (this.props.selected) {
      viewClassName += ' selected';
      hoverClass = 'none';
    }

    return (
      <View className={viewClassName} hoverClass={hoverClass} onClick={this.clickHandler}
            style={{backgroundColor: color}} />
    );
  }
}
