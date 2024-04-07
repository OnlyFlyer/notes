
let caches = null;
function useMemo(fn, deps) {
  if (!caches) {
    // 第一次进入
    const result = fn();
    caches = [deps, result];
    return result;
  } else {
    const [cacheDeps, cacheResult] = caches;
    if (deps.every((dep, index) => dep === cacheDeps[index])) {
      return cacheResult;
    } else {
      const result = fn();
      caches = [deps, result];
      return result;
    }
  }
};

let cbCaches = null;
function useCallback(fn, deps) {
  if (!cbCaches) {
    // 第一次执行
    cbCaches = [fn, deps];
    return fn;
  } else {
    const [cachedFn, cachedDeps] = cbCaches;
    if (deps.every((dep, index) => dep === cachedDeps[index])) {
      return cachedFn;
    } else {
      cbCaches = [fn, deps];
      return fn;
    };
  };
};

let cacheState = [];
let index = 0;
function useState(initialState) {
  let curIndex = index;
  cacheState[curIndex] = cacheState[curIndex] === undefined ? initialState : cacheState[curIndex];
  const setState = (newState) => {
    cacheState[curIndex] = newState;
    render(App);
    index = 0;
  };
  index+=1;
  return [cacheState[curIndex], setState];
};


function useRef(initial) {
  const hook = mountWorkInProgressHook();
  const ref = { current: initial };
  hook.memoizedState = ref;
  return ref;
};



let nextUnitOfWork = null;
let wipRoot = null;

// reconcileChildren 其实也就是协调的过程
function buildFiber(fiber) {
  const { children } = fiber;
  let index = 0;
  let prevSibling = null;
  while (index < children.length) {
    const ele = children[index];
    const newFiber = {
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

function performUnitOfWork(fiber) {
  buildFiber(fiber);
  if (fiber.child) {
    return fiber.child;
  }
  // 没有找到 child，且没有找到 sibling，就需要往上去回溯，但是此时回溯只
  // 能找 sibling，不能再找 child，因为 child 已经遍历过了
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
};


function workLoop(deadLine) {
  let xx = false;
  while (nextUnitOfWork && xx) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    xx = deadLine.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

class PubSub {
  constructor(){
    this.listeners = {};
  }
  publish(event, data) {
    const currentEventListeners = this.listeners[event];
    if (currentEventListeners) {
      currentEventListeners.forEach(listener => {
        listener(data);
      });
    }
  }
  subscribe(event, callback) {
    if (typeof callback !== 'function') {
      throw Error('callback is not a function!');
    }
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
}

class Store {
  constructor(initialState) {
    this.events = new PubSub();
    this.state = new Proxy(initialState || {}, {
      set: (state, key, value) => {
        state[key] = value;
        this.events.publish('changed', state);
        return true;
      },
    });
  };
  dispatch(type, payload) {
    if (type === 'add') {
      this.state.add = payload;
    } // ...
  };
  getState() {
    return this.state;
  };
  subscribe(key, fn,) {};
  publish() {};
  unsubscribe() {};
};

class Component {
  constructor(props) {
    if (props.store instanceof Store) {
      this.store = props.store;
      this.store.events.subscribe('changed', (state) => {
        this.render(state);
      });
    }
  };
  render(state) {
    // renderer
  };
};

window.requestIdleCallback = function (handler) {
  let startTime = Date.now()
  return setTimeout(function () {
    handler({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50.0 - (Date.now() - startTime))
      },
    })
  }, 1)
}

var allTagNames = []
var tagMap = new Map();
var unitTags = [];
function getUniTag() {
  allTagNames = Array.prototype.slice.call(document.querySelectorAll('*')).map(tag => tag.tagName);
  tagMap = new Map();
  allTagNames.forEach((tagName) => {
    if (tagMap.has(tagName)) {
      tagMap.set(tagName, tagMap.get(tagName) + 1);
    } else {
      tagMap.set(tagName, 1);
    }
  });
  unitTags = [];
  tagMap.forEach((val, key) => {
    if (val === 1) {
      unitTags.push(key);
    }
  });
  console.log(unitTags, '--unitTags');
  console.log(tagMap, '--tagMap');
  console.log(allTagNames, '--allTagNames');
};

function add() {
  let cache = 0;
  if (!arguments.length) return cache;
  cache += Array.prototype.reduce.call(arguments, (p, c) => p + c, 0);
  return function(...args) {
    if (!args.length) return cache;
    return add(...args, cache);
  };
};

function adder() {
  let cache = 0;
  if (!arguments.length) return cache;
  cache += Array.prototype.reduce.call(arguments, (p, c) => p + c, 0);
  const fn = function(...args) {
    return adder(...args, cache);
  };
  fn.valueOf = function() {
    console.log(cache, '-valueOf');
    return cache;
  };
  fn.toString = function() {
    console.log(cache, '-valueOf');
    return cache;
  };
  return fn;
};

add(1)(2)() // 3
add(1)(2)(3)(4)() // 10

setTimeout(function() {
  console.log(1);
}, 0);
console.log(2);
async function s1() {
  console.log(7)
  await s2();
  console.log(8);
}
asycn function s2() {
  console.log(9);
}
s1();
new Promise((resolve, reject) => {
  console.log(3);
  resolve();
  console.log(6);
}).then(() => console.log(4))
console.log(5);

let n1 = nums1.length;
let n2 = nums2.length;

// 两个数组总长度
let len = n1 + n2;

let p1 = 0;
let p2 = 0;
let prevValue = -1;
let currValue = -1;
for (let i = 0; i < Math.floor(len / 2); i++) {
  prevValue = currValue;
  if (p1 < n1 && (p2 >= n2 || nums1[p1] < nums2[p2])) {
      currValue = nums1[p1];
      p1++;
  } else {
      currValue = nums2[p2];
      p2++;
  }
}
if (len%2 === 0) {
  return (prevValue + currValue) / 2;
} else {
  return currValue;
}
