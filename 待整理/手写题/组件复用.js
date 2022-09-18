// 1. HOC 高阶组件
// 参数为组件，返回值是将组件转换为另一个组件

// 高阶组件的实现:
// 1. props proxy 属性代理
// 2. Inheritance Inversion，不推荐
import React from 'react'
class Mounse extends React.Component {
  render () {
    const { x, y } = this.props.mouse
    return <p>The current mouse position is ({x}, {y})</p>
  }
}

class Cat extends React.Component {
  render () {
    const { x, y } = this.props.mouse
    return <div style={{position: 'absolute', left: x, top: y, backgroundColor: 'yellow',}}>i am a cat</div>
  }
}

const MouseHoc = (MouseComp, props) = {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        x: 0,
        y: 0
      }
    }
    onMouseMove = (e) => {
      this.setState({
        x: e.clientX,
        y: e.clientY
      })
    }
    render () {
      return (
        <div style={{height: '300px'}} onMouseMove={this.onMouseMove}>
          <MouseComp mouse={this.state}/>
        </div>
      )
    }
  }
}

const WithCat = MouseHoc(Cat)
const WithMouse = MouseHoc(Mounse)

const MouseTracker = () => (
  <div>
    <WithCat/>
    <WithMouse/>
  </div>
)

export default MouseTracker

// 属性代理模式下
// 1. 可以操作 props
// 2. 通过 Refs 访问组件
// 3. 提取 state
