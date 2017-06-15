# vue-mail-front
Welcome~~, 这是一个基于Vue2的邮件前端系统

### 使用
克隆或下载到本地：
```
git clone https://github.com/weihomechen/vue-mail-front.git
```
进入项目，安装依赖包：
```
npm install
# 如果不能科学上网，请使用:
npm install --registry=https://registry.npm.taobao.org
```
启动开发：
```
npm run dev
```
如果一切顺利，项目就会在本地 http://localhost:8081 跑起来了

### 邮件主要模块
- 写信（支持附件、录音、文本编辑）
- 邮件列表
- 邮件详情
- 邮件标签
- 通讯录

### 主要实现
- 基于`Vue2`
- `vuex`管理全局状态
- `vue-router`实现spa导航
- UI布局和一些功能组件使用`element-ui`
- 大部分数据使用Mock.js模拟
- 使用`Axios`模拟与后台交互
- 异步编程引入`rxjs`
- 项目初始化（环境配置）使用`Vue-cli`的`webpack`模板

### 效果图




