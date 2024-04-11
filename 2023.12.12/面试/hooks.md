## Hooks

### base hooks

1. useState

```js
const [tag, setTag] = useState(false);
// 支持传入一个值或者函数

state = {
  tag: false,
};

this.setState({
  tag: true
});

setTag(true); // 触发组件 re-render

```

2. useRef，能够避免视图更新

```js

const DemoUseRef = () => {
  const dom = useRef(null);

  const handleSubmit = () => {
    console.log(dom.current); // p
  };

  return <div>
    <p ref={dom}>111</p>
  </div>
};

const currentRef = useRef(1);

const [currentVal, setCurrentVal] = useState(1);

currentRef.current = 2; // 不会触发组件 re-render
setCurrentVal(2);

```

3. useEffect

在某些时间点触发一些方法，或者事件

componentDidMount、componentDidUpdate

```js

function getUserInfo(){
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'zhangsan',
        age: 18,
      });
    }, 2000);
  });
}

const Demo = () => {
  const [userMsg, setUserMsg] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(1);
    }, 1000);
    window.addEventListener('resize', handleSize);
    getUserInfo().then((info) => {
      setUserMsg(info);
    });
  }, []);

  // 用于清除副作用
  return function() {
    clearInterval(timer);
    window.remove('resize', handleSize);
  };
};

// useEffect中的副作用代码会在组件渲染完成后异步执行，而直接调用异步方
// 法会导致副作用代码的执行时机不受控制，可能会引起不可预测的错误。

// error, 不允许直接调用 async，因为 useEffect 执行是在 commit 阶段
useEffect(async () => {
  const res = await getUserInfo(number);
}, [number]);

// true
useEffect(() => {
  const fetchData = async () => {
    await ...
  }
  fetchData().catch();
});

```

4. useLayoutEffect

vdom -> useLayoutEffect -> DOM 更新 -> useEffect

useEffect：

组件更新挂载完成后（vdom） -> DOM 更新 -> useEffect

影响：闪动

useLayoutEffect：

组件更新挂载完成后（vdom） -> useLayoutEffect -> DOM 更新

影响：卡顿

5. useContext

parent child

useContext(ctx);

Context.Consumer

```js

export default () => {
  return (
    <div>
      <Context.Provider value={{ name: 'zhangsan' }}>
        <DemoContext />
      </Context.Provider>
    </div>
  );
};

const DemoContext = () => {
  const name = useContext('name');
  return (
    <Context.Consumer>
      {(val) => <div>{val}</div>}
    </Context.Consumer>
  );
};

```

6. useReducer

state action dispatch


```js

const DemoUseReducer = () => {
  const [number, dispatch] = useReducer((state, action) => {
    const { payload, name } = action;
    switch (name) {
      case 'a':
        return state + 1;
      case 'b':
        return state - 1;
      default:
        return state;
    };
  });
  return (
    <div>
      <p>当前值:{number}</p>
      <button onClick={() => { dispatch({ name: 'a' }); }}>+1</button>
      <button onClick={() => { dispatch({ name: 'b' }); }}>-1</button>
      <Children dispatch={dispatch} state={number} />
   </div>
  );
};

```

7. useMemo、useCallback

```js
const DemoUserMemo = () => {
  const [number, setNumber] = useState(0);
  const newLog = useMemo(() => {
    const log = () => {
      console.log(number); // 0
    };
    return log;
  }, [number]);
  return (
    <div>
      <div onClick={() => newLog()}>打印</div>
      <span onClick={() => setNumber(number+1)}>+1</span>
    </div>
  );
};

```

useMemo 返回 cb 的运行结果

useCallback 返回的是 cb 的函数


8. 自定义 hooks

setTitle

```js
import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, []);
};
export default useTitle;

const App = () => {
  // 强调的是函数式编程的思路
  useTitle('new title');
};

```

```js

import { useState } = from 'react';

const useUpdate = () => {
  const [, setFlag] = useState();
  const update = () => {
    setFlag(Date.now());
  };
  return update;
};

const App = () => {
  const update = useUpdate();

  <button onClick={update}>update</button>
};

```

手写 throttle、debounce hook

function throttle(fn, duration) {};
function debounce(fn, delay) {};

## 异步组件

React.lazy

React.Suspense

dynamic import

```js

import React, { lazy, Suspense } from 'react';

const About = lazy(() => import('./About'));

export default class extends React.Component {
  render() {
    <div>
      <Suspense fallback={<div>loading</div>}>
        <About />
      </Suspense>
    </div>
  };
};

function Suspense({ children }) {
  const [comp, setComp] = useState(<div>loading</div>);
  useEffect(() => {
    children.then(component => {
      setComp(component);
    });
  }, []);
  return comp;
};

ErrorBoundary 错误边界

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  };
  getDerivedStateFromError(error) {
    return { hasError: true };
  };

  componentDidCatch(error, errorInfo) {
    // sendError
    console.log(error, errorInfo);
  };
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children;
  };
};

function Comp() {
  return <div>111</div>
};

const App = () => {
  return (
    <ErrorBoundary>
       <Comp />
    </ErrorBoundary>
  );
};
```

lazy load component

```js

const About = lazy(() => new Promise(resolve => {
  setTimeout(() => resolve({
    default: <div>component content</div>
  }));
}));

class Suspense extends React.Component {
  state = {
    isRender: true,
  };

  componentDidCatch(e) {
    this.setState({
      isRender: false,
    });
  };
  render() {
    const { children, fallback } = this.props;
    const { isRender } = this.state;
    return isRender ? children : fallback
  };
};
```

## 高阶组件

```js

// 实现生命周期拦截
// 修改 react 树

function Hoc(WrappedComponent) {
  const didMount = WrappedComponent.prototype.componentDidMount;
  return class extends WrappedComponent {
    async componentDidMount() {
      if (didMount) {
        await didMount.apply(this);
      }
      // 自定义事件处理
    };
    render() {
      const tree = super.render();
      const newProps = {};

      if (tree && tree.type === 'input') {
        newProps.value = 'zhangsan';
      }
      const props = {
        ...tree.props,
        ...newProps,
      };
      // return super.render();
      const newTree = React.cloneElement(tree, props, tree.props.children);
      return newTree;
    };
  };
};

```

```js

function withTiming(wrappedComp) {
  let start, end;
  return class extends WrappedComp {
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
    };
    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount();
      }
      end = Date.now();
      console.log('组件渲染耗时:', end - start, 'ms')
    };
  };
};

```

