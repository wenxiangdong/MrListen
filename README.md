# Mr.Listen
微信小程序开发赛第二届-小程序-Mr.Listen

全新交互挑战-聊天式记录

---

> A Taro project

## Build Setup

首先，你需要使用 npm 或者 yarn 全局安装`@tarojs/cli`，或者直接使用 [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b):

~~~shell
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli
# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli
# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli
~~~

安装完毕之后即可在 **\mr-listen\client** 目录下使用 npm 或 yarn 安装依赖

~~~shell
# 使用 yarn 安装依赖
$ yarn
# OR 使用 cnpm 安装依赖
$ cnpm install
# OR 使用 npm 安装依赖
$ npm install
~~~

和编译 （**因为框架的问题，有可能在编译后出现莫名的错误，这种情况下请多编译几次**）

~~~shell
# yarn
$ yarn dev:weapp
$ yarn build:weapp
# npm script
$ npm run dev:weapp
$ npm run build:weapp
# 仅限全局安装
$ taro build --type weapp --watch
$ taro build --type weapp
# npx 用户也可以使用
$ npx taro build --type weapp --watch
$ npx taro build --type weapp
~~~

更多问题可参考 [taro 官网 - 安装及使用](<https://nervjs.github.io/taro/docs/GETTING-STARTED.html>)

## 注意事项

值得一提的是，如果安装过程出现`sass`相关的安装错误，请在安装[`mirror-config-china`](https://www.npmjs.com/package/mirror-config-china)后重试。

~~~shell
$ npm install -g mirror-config-china
~~~

