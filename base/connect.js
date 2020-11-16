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