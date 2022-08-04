// connect 是一个高阶函数, 它接受两个参数，mapStateToProps 
// 和 mapDispatchToProps，两个参数均为函数， 且都返回
// 一个对象， connect 内部做了一些操作，将 store.getState()
//  和 store.dispatch分别注入两个函数的参数中，用户可以选择
// 自己所需的 state 和 dispatch 重命名然后返回，connect 在
// 内部将返回的state 和 dispatch 通过 props 的方式传到包裹的组件中

export function connect (mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    class Base extends React.Component {
      contextTypes = {
        store: PropTypes.object
      }
      componentDidMount () {
        this.context.store.subscribe(this.handleStoreChange)
      }
      handleStoreChange = () => {
        this.forceUpdate()
      }
      render () {
        const { store } = this.context
        const { getState, dispatch } = store
        return (
          <Component
            {...this.props}
            {...mapStateToProps(getState())}
            {...mapDispatchToProps(dispatch)}
          />
        )
      }
    }
    return Base
  }
}