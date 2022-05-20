# JSX 语法


JSX 被 babel 编译成 React.createElement() 这种方式

React.createElement(type, [props], [...children])

createElement 参数：

第一个参数： 如果是组件类型，会传入组件对应的类或者函数，如果是 dom 元素类型，传入 div 或 span 之类的字符串。

第二个参数：一个对象，在 dom 类型中为 标签属性，在组件类型中为 props。

其他参数，依次为 children，根据顺序排列

```JavaScript

<div>
  <TextComponent />
  <div>hello world</div>
  hhh
</div>

```

上面的代码会被 babel 先编译成：

React.createElement(
  'div',
  null,
  React.createElement(TextComponent, null),
  React.createElement('div', null, 'hello word'),
  'hhh'
)


问：老版本的 React中，为什么写 JSX 文件要引入 React ？

答：JSX 文件代码被 babel 编译成了 React.createElement 形式，如果没有引入 React，会引起报错。


JSX 元素类型：

element 元素类型（div、span）
fragment 类型（symbol react.fragment 类型）
文本类型（字符串）
数组类型： 返回数据结构，里面元素被 createElement 转换
组件类型： 组件类或组件函数本身
三元运算：先执行三元运算，然后按照上面的规则处理
函数执行：先执行函数，然后按上述规则处理


最后，在调和阶段，上面的 React element 对象的每一个子节点都会形成一个与之对应的 fiber 对象，通过 sibling、return、child 将每个 fiber 对象联系起来

React 针对不同的 React element 对象会产生不同 tag（种类）的 fiber 对象，

1. FunctionComponent=0 函数组件
2. ClassComponent=1 类组件
3. IndeterminateComponent=2 初始化的时候不知道是函数组件还是类组件
4. HostRoot=3 Root Fiber 可理解为根元素，通过ReactDOM.render 产生的根元素
5. HostPortal createPortal 产生的 Portal
6. ...


fiber 对应关系

1. child：一个由父级 fiber 指向子级 fiber 的指针
2. return：一个子级 fiber 指向父级 fiber 的指针
3. sibling：一个 fiber 指向下一个兄弟 fiber 的指针


在 JSX 中写的 map 数组结构的子节点，外层会被加上 fragment

map 返回数组结构，作为 fragment 的子节点


<!-- 扁平化 children 数组，还可深层次 flat -->
React.Children.toArray(children)

React.Children.forEach = React.Children.toArray + Array.prototyp.forEach

<!-- 检测是否为 React Element 元素 -->
React.isValidElement(element)

React.cloneElement：以 element 元素为样板克隆并返回新的 React element 元素，返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果


问： React.createElement 和 React.cloneElement 到底有什么区别？
答：一个为了创建，一个为了修改，返回值均为 React element 对象


JSX 语法实现源于

@babel/plugin-syntax-jsx：能让 Babel 解析 JSX 语法

@babel/plugin-transform-react-jsx：内部调用了 @babel/plugin-syntax-jsx，可以把 React JSX 转换成 JS 能够识别的 createElement 格式。

两个插件

Automatic Runtime

```JavaScript

import { jsx as _jsx } from 'react/jsx-runtime';
import { jsxs as _jsxs } from 'react/jsx-runtime';


function Index() {
  return _jsxs('div', {
    children: [
      _jsx('h1', {children: 'hello world'}),
      _jsx('span', {children: 'hhh'})
    ]
  })
}

```

需要设置


```JavaScript

.babelrc

presets: [
  ['@babel/preset-react', {
    runtime: 'automatic'
  }]
]

```

Classic Runtime


使用 JSX 需要引入 React，不然会报错

```JavaScript

import React from 'react';

function Index() {
  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'hello world'),
    React.createElement('span', null, 'hhh'),
  )
}

```




