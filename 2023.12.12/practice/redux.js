//! createStore 源码
export function createStore(reducer) {
  const currentState = {};
  const currentListener = [];
  function getState() {
    return currentState;
  };
  function dispatch(action) {
    currentState = reducer(currentState, action);
  };
  function subscribe(listener) {
    currentListener.push(listener);
    return () => {
      const index = currentListener.find((_listener) => _listener === listener);
      currentListener.splice(index, 1);
    }
  }

  dispatch({ type: 'ADD/REDUX' });

  return {
    dispatch,
    subscribe,
    getState,
  };

};

//! Redux 支持异步(中间键)
const store = createStore();
const minus = () => {
  store.dispatch((dispatch) => {
    setTimeout(() => {
      dispatch({ type: 'MINUS' });
    }, 1000);
  });
};

function compose(...funcs){
  if(funcs.length === 0) return arg => arg;
  if(funcs.length === 1) return funcs[0];
  return funcs.reduce((prev,curr)=> (...args)=> prev(curr(...args)))
}

export function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);
    const midAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => store.dispatch(action, ...args),
    }
    const middlewareChain = middlewares.map(middleware => middleware(midAPI));
    const dispatch = compose(...middlewareChain)(store.dispatch);
    return {
      ...store,
      dispatch,
    };
  };
}

//! 中间件 logger 的实现
export function logger({ getState, dispatch }) {
  return (next) => (action) => {
    console.log('执行了', action.type);
    const prevState = getState();
    console.log('prev state', prevState);
    const returnValue = next(action);
    const nextState = getState();
    console.log('next state', nextState);
    return returnValue;
  };
}

export function combineReducers(reducers) {
  return function combination(state, action) {
    let nextState = {};
    let hasChanges = false;
    for (const key in reducers) {
      const reducer = reducers[key];
      nextState[key] = reducer(state[key], action);
      hasChanges = hasChanges || nextState[key] !== state[key];
    }
    hasChanges = hasChanges || Object.keys(nextState).length !== Object.keys(state).length;
    return hasChanges ? nextState : state;
  }
};

const Context = React.createContext();

export function Provider({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>
};

function useForceUpdate(){
  const [state, setState] = useState(0)
  const update = useCallback(()=>{
      setState(prev=>prev+1)
  },[])
  return update
}

// 3 后代消费Provider传递下来的value
export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => (props) => {
  const store = useContext(Context);
  const { getState, dispatch, subscribe } = store;
  const stateProps = mapStateToProps(getState());
  const dispatchProps = {dispatch};
  const forceUpdate = useForceUpdate();
  useLayoutEffect(() => {
    const unsubscribe = subscribe(() => {
      forceUpdate();
    });
    return () => {
      unsubscribe();
    };
  }, [subscribe]);
  return (<WrappedComponent {...props} {...stateProps} {...dispatchProps} />)
}
