# React 简介

1. class 和 fn 就是 UI 的载体

2. data 传入 React，输出 UI

3. 组件化思想

4. 跨平台能力，支持 Node 进行服务端渲染，React Native 进行原生移动应用开发，或者 Taro，写一套 React 代码，适用于多个平台。


V16.0 为了解决大型应用一次更新大量虚拟 DOM 带来的卡顿问题，React 重写了 核型模块 Reconciler，启用了 Fiber 架构，为了让节点渲染到指定容器内，更好的实现弹窗功能，推出了 createPotal APi，引入了 componentDidCatch 钩子，划分了错误边界。

V16.2 推出 Fragment，解决数组元素问题

V16.3 增加 React.createRef() API，可通过 createRef 取得 Ref 对象，增加 forwardRef() API，解决高阶组件 ref 传递问题，推出新版本 context API，迎接 Provider / Consumer 时代，增加 getDerivedStateFromProps 和 getSnapshotBeforeUpdate 生命周期。

V16.6 增加 memo API，控制子组件渲染，增加 lazy API 实现代码分割，增加 contextType 让类组件更方便使用 context，增加生命周期 getDerivedStateFrom Error 代替 componentDidCatch

V16.8 支持 Hooks

V17 事件绑定由 document 变成 container，移除事件池