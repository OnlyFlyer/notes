// rematch 中 dispatch 既是一个函数又是一个对象，方便使用

dispatch({ type: 'xx', payload: '' });
dispatch.user.getUser();
function myDispatch() {};

function createDispatch(store) {
  const dispatch = (type, payload) => {
    store.dispatch({ type, payload });
  };
  // 将每个 model 的 effect action 添加到 dispatch 对象上
  for (const modelName in store.models) {
    const model = store.models[modelName];
    for (const actionName in model.effects) {
      // 使用闭包将 actionName 和 modelName 绑定到当前作用域
      const effectAction = (payload) => dispatch(`${modelName}/${actionName}`, payload);
      dispatch[modelName][actionName] = effectAction;
    };
  };
  return dispatch;
};

function init() {
  const store = createStore(config);
  const dispatch = createDispatch(store);
};
