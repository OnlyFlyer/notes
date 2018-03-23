# 初识React Native

## ReactNative简介
  写完了
  1. 前端的发展历程
      - 前端已经高速发展了十年了, 而且现在还在不断的在前行, 我们看到了浏览器厂商的竞争, 如: 搜狗/UC/百度..., 也经历了各种类库的竞争, 也经历了 JavaScript 的更新换代, 现在的 JavaScript 已经不在是止步于脚本的简单交互的语言了.
      - 现在整个互联网应用从轻量化的 Web 网页到 富客户端 App 的变化, 前端应用的规模越来越大, 交互也愈来愈复杂了, 近几年, 前端工程用简单的方法库jQuery 已经不能维系应用的复杂度, 需要使用框架的思想去构建应用, 我们看到 MVC、MVVM 这些前端分层模型都出现在前端开发的过程中. 这都是前端迎接挑战和发展时沉淀下来的.
  2. 引入 React Native

写完了

  3. 浅析 React Native

      - React Native 是基于 React 实现的, 很多人将 React 理解为 View 库, 但是从功能上看, React Native 可是比 View 层复杂多了, 就拿 Virtual DOM, 服务端渲染来看, 这些就已经足够让我们来一场新的思考.
      - 官方是这样描述  React 的: 创造 React 是为了构建随着时间数据不断变化的大规模应用程序. 为了性能和效率, React 结合了 Virtual DOM 渲染技术, 让组件的思路可行, 高耦合, 低内聚, 我们只需要关注组件自身的逻辑, 再将其组合起来就是一个大型的复杂的应用程序, 丝毫不用关心逻辑过于复杂, 应用过于庞大而引发的性能问题.

  4. 小结

      - 借用<< 深入React技术栈 >>`(这是引用)`中的一句话: React 必然不过是一块小石头沉入水底, 但它溅起的涟漪却影响了无数的前端开发的思维, 影响了无数应用的构建. 对于它来说, 这些就是它的成就. 成就 JavaScript 的繁荣, 成就前端标准更快的推进.
## JSX语法
写完了
1. JSX的由来

写完了
2. JSX的基本语法

写完了
3. JavaScript属性表达式

      - 子组件也可以作为表达式使用:
```JavaScript
  // 输入
  const content = <Container>{window.isLoggedIn ? <Nav /> : <Login />}</Container>

  // 输出
  const content = React.createElement(
    Container,
    null,
    window.isLoggedIn ? React.createElement(Nav) : React.createElement(Login)
  )

```
6. 小结

      - 本节主要是认识了 JSX 语法, 如果要深入 React 和 React Native , JSX 可谓是必经之路, 同时也有助于对静态编译, 服务端渲染的理解, 之后 React 的又一大亮点在于组件的属性中可以直接嵌入 JavaScript 属性表达式而不用像模版引擎那样拼接字符串.
## React数据流
在 React 中, 数据是自顶向下单向流动的, 即从父组件到子组件. state 和 props 是 React 组件中很重要的概念, 若顶层组件初始化 props, 那么 React 会向下遍历整棵组件树,重新尝试渲染所有相关的子组件. 而 state 只关心每个组件自己内部的状态, 这些状态只能在组件内改变. 把组件看作一个函数, 那么它接受了 props 作为参数, 内部由 state 作为函数的内部参数, 返回一个 Virtual DOM 的实现.
1. state

    - 在 React 之前, 常见的 MVC 框架如 Backbone是将 View 中与界面交互的状态解耦, 一般将状态放在 Model 中管理. 在 React 中, 把这类状态统称为 state.
    - 当组件内部使用 React 库内置的 setState 方法时, 最大的表现行为就是该组件会尝试重新渲染. 如下面的 `例2.3..4.4`

```JavaScript
  import React, { Component } from 'React'

  class xx extends Component {
    constructor (props) {
      super(props)
    }
    addTo () {
      const { iNow } = this.state
      this.setState({
        iNow: iNow + 1
      })
    }
    render () {
      const { iNow } = this.state
      return (
        <div>
          <span>当前的值: { iNow }</span>
          <button onClick={this.addTo}></button>
        </div>
      )
    }
  }

```

在 React 中常常在事件处理方法中 setState, `例.3.3.5` 就是通过点击触发 addTo 函数的不断执行, 而每次执行 addTo 函数都会 setState 一次, 从而导致页面重新渲染一次, 这样的话就可以把组件内状态封装在实现中.

值得注意的是, setState 是一个异步方法, 一个生命周期内的所有 setState 方法会合并操作, 也就是setState 会有依赖收集, 有了依赖收集, 我们可以只用 React 来完成对行为的控制、 数据的更新和页面的渲染, 但是如果过多的内部状态会让数据混乱, 程序难以维护, 因此要合理使用 setState 而非乱用.

2. props

      - props 是 React 中另一个重要的概念, props(properties), props 用来让组件之间相互联系的一种机制, 就像一个方法的参数.
      - props 的传递过程对于 React 组件来说是非常直观的. React 的单向数据流, 主要的流动管道就是 props, props 本身是不可变的. 如果我们改变 props 的初始值, React 就会报错, 组件的 props 要么来自默认属性要么来自父组件传递.
      - React 为 props 提供了默认配置, `例2.32..34`

```JavaScript

  import React, { Component } from 'React'

  class ComponentA extends Component {
    constructor(props){
      super(props)
      static defaultProps = {
        aa: 'Hello World!',
        bb: 'good morning!'
      }
    }
    render () {
      const { aa } = this.props
      return (
        <div>aa</div>
      )
    }
  }
```

如`例23.4.34.5`, 若组件 ComponentA 的父组件没有传递给 ComponentA aa 这个属性, 那么 ComponentA 会调用 defaultProps 中的 aa 值
3. 小结
## React生命周期
没写
1. ...
2. ...
3. ...
4. ...
5. ...
6. 小结
## 本章小结
1. ...
2. ...
3. ...