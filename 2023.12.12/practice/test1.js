let nextUnitOfWork = null;
let wipRoot = null;
let deletions = null; // 需要删除的 fiber 节点
let currentRoot = null;

// test
const _fiber = {
  name: 'xx',
  child: {},
  return: {}, // parent
  sibling: {}, // 兄弟
  children: [], // vdom babel 编译后的结构
  alternate: {}, // 上一次的fiber结构
};

function buildFiber(fiber) {
  const { children } = fiber;
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  while (index < children.length) {
    const ele = children[index];
    let newFiber = null;
    const sameType = oldFiber && ele && ele.type == oldFiber.type;
    if (sameType) {
      // 类型不变
      newFiber = {
        type: oldFiber.type, // 类型还是用老的就可以
        props: element.props, // 属性要用新的
        dom: oldFiber.dom, // dom 也用老的
        return: fiber, // parent 用 wipRoot 就好
        alternate: oldFiber, // 老的
        effectTag: "UPDATE" // 更新即可
      };
    }
    // 类型不同，用新的
    if (ele && !sameType) {
      newFiber = {
        type: ele.type,
        props: ele.props,
        dom: null,
        return: fiber,
        alternate: null,
        effectTag: "PLACEMENT" // 需要重新创建
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
    }
    newFiber = {
      name: ele.name,
      children: ele.children,
      return: fiber,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else if (ele) {
      prevSibling?.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
    // buildFiber(newFiber);
  }
};

function performUnitOfWork(fiber) {
  buildFiber(fiber);
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.return;
  }
  nextFiber = nextFiber.return;
};

const isEvent = key => key.startsWith("on");
const isProperty = key => key !== "children" && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);
function updateDom(dom, prevProps, nextProps) {
  // 删除老的或者改变的 listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(eventName => {
      const eventType = eventName.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[eventName]);
    });

  // 删除老的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(propName => {
      dom[propName] = '';
    });

  // 设置新的活着改变的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(propName => {
      dom[propName] = nextProps[propName];
    });

  // 创建新的 listener
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(eventName => {
      const eventType = eventName.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[eventName]);
    });
};

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  };
};

function commitWork(fiber) {
  if (!fiber) return;
  let domParentFiber = fiber.return;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.return;
  }
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
};
function workLoop(deadLine) {
  let xx = false;
  while(!nextUnitOfWork && xx) {
    // diff 计算
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    xx = deadLine.timeRemaining() < 1;
  };

  while (!nextUnitOfWork && wipRoot) {
    // commit 阶段，进行 dom 节点的增删改擦
    commitRoot();
  }

  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);
