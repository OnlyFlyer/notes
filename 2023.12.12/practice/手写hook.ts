// hooks 原理

// 1. hook 本质就是函数，每次render都会重新执行，那么函数是没有状态的，React 是将状态
// 数据放到了对应 fiber 节点上的 memorizedState上，这个数据是一个链表，链表的顺序就是
// 当前 fiber 节点所有用到的所有hook。通过构建 memorizedState 这样一个链表来保持执行
// 顺序的一致，这也是为什么 hook 不能定义在判断和循环里，因为这样会影响组件下一次更新时的 hook 链表结构，
// current 树的 memorizedState 缓存 hook 信息，和当前 workInProgress 不一致，如果涉及到
// 读取state等操作，就会发生异常。

// 2. hook 执行内部区分初次执行和多次执行两个步骤，第一次执行是调用的 mountHook ，第二次则调用的是
// updateHook

// 我在开发中常使用的 hook 有 useState，useCallback，useMemo，useRef，effect hook 等等

let hookState: Array<any> = [];
let hookIndex = 0;

// useMemo
function useMemo(fn, deps) {
  // 非首次渲染
  if (hookState[0]) {
    const [lastValue, lastDeps] = hookState[0];
    const hasSame = deps.every((item, index) => item === lastDeps[index]);
    if (hasSame) {
      return lastValue;
    }
  }
  const result = fn();
  hookState = [result, deps];
  return result;
};

function memoWrapper() {
  let cacheState: Array<any> = [];
  return function realMemoFn(fn, deps) {
    if (cacheState[0]) {
      const [lastValue, lastDeps] = cacheState[0];
      const hasSame = deps.every((item, index) => item === lastDeps[index]);
      if (hasSame) {
        return lastValue;
      }
    }
    const result = fn();
    console.log('重新计算过');
    cacheState = [[result, deps]];
    return result;

  };
};

const MyMemo = memoWrapper();

const b = MyMemo(() => {
// @ts-ignore
  return a + b;
// @ts-ignore
}, [a, b]);

// useCallback
function useCallback(callback, deps) {
  // 说明不是第一次渲染
  if (hookState[hookIndex]) {
    let [lastCb, lastDeps] = hookState[hookIndex];
    const same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastCb;
    }
  }
  // 第一次渲染 或者 不是第一次但是依赖项相同，都返回新的
  hookState[hookIndex] = [callback, deps];
  hookIndex++;
  return callback;
};


let cache: Array<{ cacheCb: Function, cacheDeps: any[] }> = [];
let index: number = 0;
function xxCallback(callback, deps) {
  if (cache.length) {
    const { cacheCb, cacheDeps } = cache[index];
    const hasSame = deps.every((item, index) => item === cacheDeps[index]);
    if (hasSame) {
      index++;
      return cacheCb;
    }
  }
  cache[index] = { cacheCb: callback, cacheDeps: deps };
  index++;
  return callback;
};

// memorize
// function memorize(f) {
// 	if (!f.cache) f.cache = {};
// 	return function() {
// 		var cacheId = [].slice.call(arguments).join('');
// 		console.log(this);
// 		return f.cache[cacheId] ?
// 				f.cache[cacheId] :
// 				f.cache[cacheId] = f.apply(window, arguments);
// 	};
// }

function MyMemorize(fn) {
  if (!fn.cache) fn.cache = new Map();
  return function() {
    const args = [...arguments];
    const cacheId = args.join('');
    if (fn.cache[cacheId]) return fn.cache[cacheId];
    const result = fn(...args);
    fn.cache[cacheId] = result;
    return result;
  };
};

type ITree = {
  name: string;
  children: ITree[];
};

// 页面中可能会有多个 useState;
let states: Array<any> = [];
let currentHook = 0;
function useState(initState) {
  if (typeof states[currentHook] === 'undefined') {
    states[currentHook] = initState;
  }
  let hookIndex = currentHook;
  function setState(valOrCb) {
    const _state = typeof valOrCb === 'function' ? valOrCb(states[hookIndex]) : valOrCb;
    states[hookIndex] = _state;
    // ReactDOM.render(<App />, 'root');
  };
  return [states[currentHook++], setState];
};



// 根据数据结构创建一个 fiber 结构
const tree: ITree = {
  name: 'A',
  children: [
    { name: 'B', children: [{ name: 'E', children: [] }, { name: 'F', children: [] }] },
    { name: 'C', children: [] },
    {
      name: 'D',
      children: [
        { name: 'G', children: [] },
        { name: 'H', children: [{ name: 'I', children: [] }] }
      ]
    },
  ],
};
type IFiber = {
  name: string;
  return?: IFiber | null;
  child?: IFiber | null;
  sibling?: IFiber | null;
  children: ITree[];
};
const wipRoot: IFiber = {
  name: 'root',
  return: null,
  sibling: null,
  child: null,
  children: [tree],
};

function buildFiber(fiber: IFiber) {
  const { children } = fiber;
  let index = 0;
  let prevSibling: Pick<IFiber, 'sibling'> | null = null;
  while (index < children.length) {
    const ele = children[index];
    const newFiber: IFiber = {
      name: ele.name,
      children: ele.children,
      return: fiber,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else if(ele) {
      prevSibling?.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
    buildFiber(newFiber);
  }
};

buildFiber(wipRoot);
