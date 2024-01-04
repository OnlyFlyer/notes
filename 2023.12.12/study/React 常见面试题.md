# React 常见面试题


## HOC（higher order component）

高阶组件，纯函数，无副作用


```js
function hoc(compA){
  return compB;
}

```

优点：

1. 抽离重复逻辑，实现组件复用
2. 可以做条件渲染，渲染拦截
3. 拦截组件的生命周期!

### 属性代理（操作 props）

```js
// 函数式组件
function HOC(WrapperComp) {
  const newProps = {
    hocType: 'hoc',
  };
  return (props) => <WrapperComp {...props} {...newProps} />
};

// 类组件
function HOC(WrapperComp) {
  return class extends React.Component {
    render() {
      const newProps = {
        hocType: 'hoc',
      };
      return <WrapperComp {...this.props} {...newProps} />
    }
  };
}

```

### 条件渲染

```js

function HOC(WrapperComp) {
  return props => {
    if (!props.isShow) return 'empty!';
    return <WrapperComp {...props} />
  };
}

```

### 外部逻辑封装

```js

function HOC(WrapperComp) {
  return (props) => {
    return (
      <>
        <p>extra view</p>
        <WrapperComp {...props} />
      </>
    );
  };
}

```

### 反向继承

```js

// 为什么函数不行，因为只有类才有继承这一说法，函数是没有的
function HOC(WrapperComp) {
  return class extends WrapperComp {
    componentDidMount() {
      if (WrapperComp.prototype.componentDidMount) {
        await WrapperComp.prototype.componentDidMount.apply(this);
      }
      // 额外的事件定义
    };
    render() {
      return super.render();
    };
  };
}

// 1. 可以访问 props、state
// 2. 可以拦截生命周期


// 例子：计算组件的渲染耗时
class Home extends React.Component {
  render() {
    return <h1>home</h1>
  };
};

function withTiming(WrapperComp) {
  let start, end;
  return class extends WrapperComp {
    constructor(props) {
      super(props);
      start = 0;
      end = 0;
    }
    componentWillMount() {
      if (super.componentWillMount) {
        super.componentWillMount();
      }
      start = Date.now();
    }
    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount();
      }
      end = Date.now();
      console.log(`组件渲染耗时: ${end - start} ms`);
    }
  };
}

```

## fiber

16.8 fiber 架构

```js

const p =  <p>i'm {name}</p>

import { jsxs as _jsxs } from "react/jsx-runtime";
const p = /*#__PURE__*/_jsxs("p", {
  children: ["i'm ", name]
});

// React.createElement

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

```

### 手写 render

```js
// 浏览器中：ReactDOM
ReactDOM.render(<App />, document.getElementById('root'));

function render(vDom, container) {
  let dom;
  // 区分元素标签还是文字标签
  if (typeof vDom !== 'object') {
    dom = document.createTextNode(vDom);
  } else {
    dom = document.createElement(vDom.type);
  }

  // 附加 props
  if (vDom.props) {
    Object.keys(vDom.props).forEach((prop) => {
      dom[prop] = vDom.props[prop];
    })
  }
  // 若有子元素，则递归调用 render
  if (vDom.props && vDom.props.children && vDom.props.children.length) {
    vDom.props.children.forEach((child) => {
      render(child, dom);
    });
  }
  container.appendChild(dom);
}
```

### 为什么需要 fiber

vDom -> dom renderer 渲染器

reconciler (协调器 / diff) vDom 区分/比较，选择性的更新（什么时候才能更新）

react 16.8 之前 diff 算法是一个同步的过程，比较完成之后才能去更新

1. 同步不可中断 -> 异步 可中断
2. scheduler（调度器） 任务的优先级 有些调用的情况 - 所以 变成了 __UN_SAFE_componentWillMount / 用户操作行为最高优先级


requestIdleCallback（兼容性不好，ios 不兼容）

fiber 核心 在 React-Reconciler/ReactFiberWorkLoop.js 的 workLoopSync 方法里面

fiber 的数据结构是一棵树

1. child： 父节点指向第一个子节点的指针
2. sibling：从第一个子节点开始指向下一个兄弟元素
3. return：所有子元素都有的指向父元素的指针

```js

// The work loop is an extremely hot path. Tell Closure not to inline it.
/** @noinline */
function workLoopSync() {
  // Perform work without checking if we need to yield between fiber.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

```

## React super 和 super(props) 区别

```js

// React 内部执行（类组件）
const ins = new YourComp(props);
ins.props = props;

const result = ins.render();

// React 内部执行（函数式组件）
const result = YourComp(props);

// 类组件是基于 ES6，通过 super 将 props 赋值给 this

super(); // 将 props 赋值给 this，如果不传入 props，那么此时获取 this.props 其实是 undefined，

// constructor 中必须要调用 super，无论是否传入 props，否则会报错

```

```js

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i];
    if (
      !hasOwnProperty.call(objB, currentKey) ||
      // $FlowFixMe[incompatible-use] lost refinement of `objB`
      !is(objA[currentKey], objB[currentKey])
    ) {
      return false;
    }
  }

  return true;
}

```


## 谈谈对 React 的理解？有哪些特性

### 是什么？
是什么？ JS 库，提供了 UI 层面的解决方案
单向数据流
帮助我们将页面拆分层各个独立的模块，也就是我们常见的组件，通过这些组件组合、嵌套构建整体的页面
目前两种方式去实现，1. 类组件 2. 函数组件

### 特性

1. JSX 语法
2. 单向数据流
3. 虚拟DOM
