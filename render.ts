
const Didact = {
  render,
}

type ITreeItem = {
  type: string;
  props: {
    children: ITreeItem[];
    [key: string]: any;
  };
};


export function render(tree: ITreeItem, container) {
  const node = document.createElement(tree.type);
  const { children, ...otherProps } = tree.props;
  Object.keys(otherProps).forEach((prop) => {
    node[prop] = otherProps[prop];
  });
  children.forEach((child) => {
    render(child, node);
  });
  container.appendChild(node);
};
