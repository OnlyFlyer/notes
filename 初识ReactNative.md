# 初识React Native

  前几年, 小米首席执行官雷军曾经说过: 站在风口猪都能飞起来. 而这个风口就指的是移动互联网, 现如今移动互联网的发展如火如荼,移动互联网改变了我们的生活方式, 在这之前, 如果想出行可能需要自己买辆车, 如果想吃饭可能需要出去一家家寻找、预定, 如果想买衣服则需要去商场... 而现在, 只需要在手机上就能完成所有的工作, 想骑车, 有 ofo, 摩拜, 小蓝等等, 想吃饭, 有 美团, 饿了么, 百度外卖等等, 想买衣服, 有淘宝, 天猫, 京东, 蘑菇街等等, 我们只要下载相应的手机 App 就能够搞定, 而开发一款手机 App 不是一件容易的事情, 需要兼容各大系统, 各大平台, 为了提升 App 的开发效率, 此时, React Native 出现了. 

## ReactNative简介

      说到 React Native, 我必须先说一下它独一无二的口号: Learn Once, Write anywhere. 但 React Native 并不是说有就有的, 它源于 FaceBook 的一个内部项目 React , 也就是现在前端三大框架 Vue, React, Angular 之一, 因为 FaceBook 对市面上 JavaScript MVC 框架都不满意, 决定重新写一门框架. 为了 React 能够发展的更好, 更强大, 因此在 2013年5月的时候将它开源了, 开源的一大好处就是能够让世界上的程序员都能够去完善 React , 果不其然, React 框架逐渐建设起了强大的生态, Github 上的 Star 数 也稳步上升, 截至到2018年初, Star 数甚至达到了 80.4k之多。 当然, React 用的更多的是在 Web 开发中, FaceBook 的工程师们又将其延伸到了其它平台, 于是就有了 React Native, 这个极大提高了移动端开发效率的 React Native.

      不过现在的 React Native 正在茁壮成长阶段, 因此每一个版本都有很多的新功能新特点, 还有弃用的 API, 为了更好的去研究 React Native, 因此研究版本定于 0.50-stable, 建议系统 >= Android 4.1 (API 16), >= IOS 8.0, 开发环境须为 Mac OS, 图2.1-1是获取 React Native 0.50-stable源码方式:

  ![](./important/react-version.jpg)


  1. 前端的发展历程
      - 前端已经高速发展了十年了, 而且现在还在不断的在前行, 我们看到了浏览器厂商的竞争, 如: 搜狗/UC/百度..., 也经历了各种类库的竞争, 也经历了 JavaScript 的更新换代, 现在的 JavaScript 已经不在是止步于脚本的简单交互的语言了.
      - 现在整个互联网应用从轻量化的 Web 网页到 富客户端 App 的变化, 前端应用的规模越来越大, 交互也愈来愈复杂了, 近几年, 前端工程用简单的方法库jQuery 已经不能维系应用的复杂度, 需要使用框架的思想去构建应用, 我们看到 MVC、MVVM 这些前端分层模型都出现在前端开发的过程中. 这都是前端迎接挑战和发展时沉淀下来的.
  2. 引入 React Native



  3. 浅析 React Native

      - React Native 是基于 React 实现的, 很多人将 React 理解为 View 库, 但是从功能上看, React Native 可是比 View 层复杂多了, 就拿 Virtual DOM, 服务端渲染来看, 这些就已经足够让我们来一场新的思考.
      - 官方是这样描述  React 的: 创造 React 是为了构建随着时间数据不断变化的大规模应用程序. 为了性能和效率, React 结合了 Virtual DOM 渲染技术, 让组件的思路可行, 高耦合, 低内聚, 我们只需要关注组件自身的逻辑, 再将其组合起来就是一个大型的复杂的应用程序, 丝毫不用关心逻辑过于复杂, 应用过于庞大而引发的性能问题.

  4. 小结

      - 借用<< 深入React技术栈 >>`(这是引用)`中的一句话: React 必然不过是一块小石头沉入水底, 但它溅起的涟漪却影响了无数的前端开发的思维, 影响了无数应用的构建. 对于它来说, 这些就是它的成就. 成就 JavaScript 的繁荣, 成就前端标准更快的推进.
## JSX语法

  JSX 应该是 React 的第一个新的概念, 其实对于这种静态编译早在前些年就已经出现了, 虽然写法与 JavaScript 不大一样, 但是经过编译之后得到的js 文件却异曲同工, 之前的 CoffeeScript 就是例子, 不过因为 ES6 标准化的推进, 慢慢淡出了我们的视野.


1. JSX的由来

  JSX 与 React 有什么关系呢? React 引入 JSX 语法是为了方便视图层的组件化, 从而包揽了 HTML 结构化的功能. 也就是 类似于 ejs, jade(现已更名为 puge)等模板语言. 但又不尽相同, 因为 React 是通过创建和更新虚拟元素来管理整个虚拟DOM(Virtual DOM).


2. JSX的基本语法

  虚拟元素可以看作对应的真实元素, 因为虚拟元素的构建和更新都是在内存中完成的, 不会渲染到真实DOM 中去。React 创建的虚拟元素分为 DOM元素和组件元素, 不过 DOM元素 和 组件元素归根结底是一种元素, 只是从对象角度来讲, 组件元素的复杂度更高而已。众所周知, Web 页面时由一个一个的 HTML 元素嵌套堆叠起来的, 那么 JavaScript 如何来描述这些元素呢? 其实, 这些元素可以以 JSON对象来表示, 如 `例2.1`

  `例2.1`

  现在要描述一个块(div), 这用 HTML 语法表示很简单

  ```JavaScript
  
    <div class='content'>
      <span id='greeting'>Hello World!</span>
      <span id='answer'>I am fine</span>
    </div>
  
  ```
          `图2.2-1`

如图2.2-1所示, 元素的类型和属性都表示的很清楚, 而用 JavaScript 是这样表示的



```JavaScript

  let oDiv = {
    type: 'div',
    className: 'content',
    children: [
      {
        type: 'span',
        id: 'greeting',
        content: 'Hello World!'
      },
      {
        type: 'span',
        id: 'answer',
        content: 'I am fine'
      }
    ]
  }

```
            `图2.2-2`

如图2.2-2, 将 HTML 元素转换成一个 JSON 对象之后, 依然包括元素的类型和属性, 那么这样, JavaScript就可以创建 虚拟DOM 了



3. JavaScript属性表达式

React Native 为了方便服务端渲染, 支持属性值使用 JavaScript 表达式, 只需要用 {} 替换 “” 就可以了.


```JavaScript
// 输入(JSX)
Const person = <Person name={isName ? this.name : ‘五名仕’} />

// 输出(JavaScript)

Const person = React.createElement(
	Person,
{name: isName ? this.name : ‘五名仕’}
)

```

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
4. 小结

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

生命周期的概念广泛运用于各行各业, 一般说来, 生命周期是指一个不可逆的单方向的过程, 而软件开发的生命周期则稍有不同, React 组件的生命周期是根据 React 在挂载前, 挂载后, 渲染, 卸载..这些不同的阶段执行的钩子函数, 当渲染后的组件需要更新时, React 会再一次渲染页面. 基于这种特殊的执行方式, 可以将 React 生命周期分成两个大的阶段: 组件挂载或卸载时, 组件更新时.


```JavaScript
import React from 'React'

class ComponentB extends React.Component {
  defaultProps = {
    str: 'Hello',
    num: 1
  }
  constructor(props) {
    super(props)
    this.state = {
      str: 'hello'
      }
  }

  componentWillMount() {
    console.log('this is componentWillMount')
  }

  componentDidMount() {
    console.log('this is componentDidMount')
  }

  componentWillReceiveProps(nextProps) {
    console.log('this is componentWillReceiveProps')
  }

  shouldComponentUpdate() {
    console.log('this is shouldComponentUpdate')
    return true // 此处返回 true 则页面刷新, 返回 false 则不刷新
  }

  componentWillUpdate() {
    console.log('this is componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('this is componentDidUpdate')
  }

  componentWillUnmount() {
    console.log('this is componentWillUnmount')
  }
  render() {
    const { num } = this.props
    const { str } = this.state
    console.log('this is render')
      return(
        <div>
          <span>{`props:${parseInt(num)},state:${str}`}</span>
        </div>
      )
  }
}

ReactDom.render(
  <ComponentB></ComponentB>,
  document.getElementById('container')
)

```

1. 常见的生命周期函数


  componentWillMount
  componentWillReceiveProps
  showldComponentUpdate
  componentWillUpdate
  componentWillUnmount
  render
  componentDidUpdate

2. 挂载过程


  组件挂载是最基本的过程, 主要包括一些变量的声明, 数据的获取等等一系列组件状态的初始化, 如下面的 `例2.3.4`:

  ```JavaScript
  
    import React, { PropTypes } from 'React'

    class ComponentA extends React.Component{
      static defaultProps = {
        // 默认属性
      }

      static propTypes = {
        // 类型检查
      }

      constructor (props) {
        super(props)
        this.state = {}
      }

      componentWillMount () {}

      componentDidMount () {}

      render () {
        return (
          <div> template </div>
        )
      }
    }
  
  ```
在上面的 `例3.35.6.7` 中, defaultProps 之前就已经了解过了, 是默认的 props 值, 当父组件未传递或者子组件未收到时使用的值, 而 propTypes 则是跪了类型检查, 由于 JavaScript 是弱类型的脚本语言, 因此需要规范传递的 prop 值的类型, propTypes 且是 FaceBook 官方出的类型检查第三方包.

在 `例23.5.5.` 中, 有 componentWillMount 和 componentDidMount 两个生命周期函数, 从字面上就很好理解, 前者是在 挂载前调用, 后者是在 挂载后调用, 分别代表了渲染前后的时刻. 这两个生命周期函数只会在组件初始化的时候运行一次, 若在 componentWillMount 里面执行 `this.setState({})` 方法, 组件同样会更新 state, 但是组件只会渲染一次, 因此在组件挂载前这个生命周期函数里执行 `this.setState({})` 是无意义的, 可以将其放在 `this.state` 里面. 若在componentDidMount 里面调用 `this.setState({})` 方法则组件会重新渲染一次, 也就是重新走一遍生命周期, 这让组件在初始化过程就渲染了两次组件


3. 卸载过程

组件在卸载的时候比较简单, 只有 componentWillUnmount 这一个函数, 在这个函数中, 常会执行如事件回收等的操作


4. 组件更新


当父组件的状态发生变化, 从而向子组件传递 props, 或者子组件自身调用了 `this.setState({})` 方法的时候, 组件自身的 state 就会发生变化, 就会引起组件更新. 更新会执行 shuldComponentUpdate, componentWillUpdate, render, componentDidUpdate 这几个函数, 其中, shouldComponentUpdate 接受更新的props 和state , 返回的是一个 Boolean 的值, 主要是为了判断所引发的改变是否值得更新整个组件, 当返回 true则需要更新组件, 返回 false 则不需要更新组件

5. 小结
## 本章小结
1. ...
2. ...
3. ...