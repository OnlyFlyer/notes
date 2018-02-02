# React 总结


## 浅谈 `React` 的生命周期

constructor 常用

componentWillMount 常用


componentWillReceiveProps

shouldComponentUpdate

componentWillUpdate

componentDidUpdate

render 常用

componentDidMount 常用

从第一次渲染说起, 在 `创建组件` 的时候, 首先会调用一次 `constructor` 函数, 执行完毕之后会在页面渲染之前调用 `componentWillMount` 函数, 之后调用一次 `render` 函数, 最后在组件挂载之后会调用 `componentDidMount` 函数, 第一次渲染完毕, 这里着重说一下 `this.setState` 方法, 这个方法会使页面重新 `render` 一次. 在工作中有很多疑问, 一般数据获取成功后会调用 `this.setState` , 但是数据获取的位置放在 `componentWillMount` 还是 `componentDidMount` 中呢, 开始我都是放在 `componentDidMount` 中的, 昨天和同事讨论后发现, 若在 `componentDidMount` 中获取, 那么页面渲染的过程是:

```JavaScript

  constructor -> componentWillMount -> render -> componentDidMount ->(调用this.setState) -> render

```
如果放在 `componentWillMount` 中应该是这样的结果

```JavaScript

  constructor -> componentWillMount -> render -> componentDidMount

```

也就是说, 在 `componentDidMount` 中请求数据, 页面会调用 `render` 两次, 这里带来的性能损耗是巨大的, 虽然我们一般看不出来, 但是随着业务逻辑的越来越复杂, 性能优化这一块就显得很重要了, 因此之后数据请求还是放在 `componentWillMount` 里面吧.

就此打住, 之前说的都是单独组件的时候可能发生的, 但是 日常开发中 都是组件套组件, 不可能只走这些简单的流程, 那么当有子组件的时候呢?











`从页面获取从其他页面带来的数据方法:`

`this.props.navigation.state.params['xxx']`