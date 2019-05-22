import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'

import './ThemeColorPickerOption.less'

interface themeOption {
  mode: string,
  text: string,
  coverImg: string
}

interface IProp {
  theme: themeOption,
  selected: boolean,
  onSelect: () => void
}

/**
 * 主题样式预选项组件
 * @author 张李承
 * @create 2019/5/2 22:32
 */
export default class ThemeColorPickerOption extends Component<IProp, any> {

  private clickHandler = (e) => {
    e.stopPropagation();
    if (!this.props.selected && this.props.onSelect) {
      this.props.onSelect();
    }
  };

  render() {
    let {theme} = this.props;

    let viewClassName = 'color-picker-option';
    let hoverClass = 'hover-color-picker-option';
    if (this.props.selected) {
      viewClassName += ' selected';
      hoverClass = 'none';
    }

    return (
      <View className={viewClassName}
            hoverClass={hoverClass}
            onClick={this.clickHandler}
            style={{backgroundImage: `url("${theme.coverImg}")`}}
      >
        {theme.text}
      </View>
    );
  }
}

// @ts-ignore
ThemeColorPickerOption.defaultProps = {
  theme: {},
  selected: false,
  onSelect: () => {}
};
