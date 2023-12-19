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

### 属性代理

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
