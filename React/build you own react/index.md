# Build Your Own React

## 1. React.createElement

```JavaScript
  function createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: [],
      }
    }
  }
  function createElement(type, props = {}, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => {
          if (typeof child === 'object') return child;
          return createTextElement(child);
        }),
      }
    }
  }
  
  const Didact = {
    createElement,
  }

  Didact.createElement(); // == React.createElement()

```


## 2. render


```JavaScript

// 递归执行
function render(element, container) {
      const ele = element.type === 'TEXT_ELEMENT'
      ? document.createTextNode("")
      : document.createElement(element.type);
    Object.keys(element.props)
      .filter(key => key !== 'children')
      .forEach((name) => {
        ele[name] = element.props[name];
      });
      element.props.children.forEach((child) => {
      render(child, ele);
    })
    container.appendChild(ele);
}

  const Didact = {
    createElement,
    render,
  }

  const container = document.getElementById('root');
  Didact.render(ele, container);

```

## 3. （Concurrent Mode）loop（requestIdleCallback、requestAnimatationFrame）（并发模式）

调度策略（Fiber），异步，可中断


```JavaScript

/**
 * workLoop：传入的回调函数，接受一个 IdleDeadline 参数，可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态
 * timeout：如果指定了 timeout，且为正数，回调在 timeout 毫秒后还未被调用，那么回调函数将会放到事件循环中去排队（强制的，不论是否对性能是否有负面影响，不管）
 * */
 
requestIdleCallback(workLoop, { timeout: 2000 });

/** 
 * 不建议在 requestIdleCallback 回调函数内进行 DOM 修改操作，因为 requestIdleCallback 回调执行的时机是在（样式变更、布局计算完成之后的），如果在回调函数中做修改，之前做的计算就会失效，下一帧有获取布局之类的操作的话，那么浏览器就需要执行强制重排工作，会极大的影响性能，推荐放在回调函数的是一些 小块的 微任务（microTask）
*/

// ---

/** 
 * animationWidth：传入的回调函数，浏览器会在下次重绘之前调用指定的回调函数更新动画
*/
requestAnimationFrame(animationWidth);

/** 
 * React 中的并发模式并不算是真正意义上的并发，怎么说呢？真正意义上的并发模式是指多线程并发，类似于多线程语言 Java 这种，多个 Task 跑在多个线程中，而 React 中的 Concurrent Mode 是属于 多个 Task 跑在一个线程，就是 JS 主线程中的，只是说多个 Task 可以在 "runing" 和 "sleep" 来回切换，这其实跟 CPU 的执行原理类似，就是 时间切片（Timing Slicing）
*/

```

## 4. Fiber Tree（纤维树）

DFS：深度优先遍历（先child，然后再是 sibing，最后是 uncle 叔叔）


#### 为什么要设计成 Fiber Tree 这种数据结构？

答：make it easy to find the next unit of work.

parent、sibing、child(first)


```JavaScript

function performUnitOfWork(fiber) {
    // 增加 dom 节点，还需要将子节点加到父节点上
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }
    if (fiber.parent) {
      fiber.parent.dom.appendChild(fiber.dom);
    }
    // 创建一个新的 fiber
    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;
    while (index < elements.length) {
      const element = elements[index];
      const newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: null,
      }

      if (index === 0) {
        fiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
      index++;
    }

    // 返回下一个工作单元
    if (fiber.child) {
      return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }

  }

```

## 5. Render and Commit（渲染）


```JavaScript

/** 
 * 在上面的 DFS 中，有一段 dom 操作的代码，每执行一次都会操作一次 dom，这样可能会在浏览器会在我们完成渲染之前中断操作，这样用户就会看到不完整的 UI，所以需要将这一段代码放到别的地方（requestIdleCallback，这样就不会影响页面渲染）
*/

if (fiber.parent) {
  fiber.parent.dom.appendChild(fiber.dom);
}


// ---

function commitWork(fiber) {
  if (!fiber) return;
  const domFarent = fiber.parent.dom;
  domFarent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRoot() {
  commitWork(wipRoot);
  wipRoot = null;
}


function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // ****** 很重要，放到 requestIdleCallback 中渲染 dom
  if (nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
  // requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

```

## 6. Reconciliation（协调） Diff 算法




