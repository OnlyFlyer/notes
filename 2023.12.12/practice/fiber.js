const tree = {
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

const wipRoot = {
  name: 'root',
  parent: null,
  sibling: null,
  child: null,
  children: [tree],
};

let nextTreeItem = null;

requestIdleCallback(reconcileChildren);

function reconcileChildren(fiber, children = []) {
  let index = 0;
  let prevSibling = null;
  while(index < children.length) {
    const ele = children[index];
    const { name, children: _children } = ele;
    const newFiber = {
      name,
      children: _children,
      parent: fiber,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else if (ele) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
    reconcileChildren(newFiber, newFiber.children);
  }
};
