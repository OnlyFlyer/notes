
// const p = new Constructor('a', 'b'); -> objectFactory(Constructor, 'a', 'b');

function objectFactory() {
  const obj = {}; // 或者使用 Object.create({});
  const Constructor = [...arguments].shift();
  const args = [...arguments].slice(1);
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, args);
  // 此处加判断是为了区分构造函数有返回值的情况
  return typeof result === 'object' ? result : obj;
};

Function.prototype.MyBind = function(ctx) {
  const _ctx = ctx || window;
  const _args = [...arguments].slice(1);
  const tempFn = Symbol();
  _ctx[tempFn] = this;
  return function (...args) {
    const result = _ctx[tempFn](..._args, ...args);
    delete _ctx[tempFn];
    return result;
  };
};

Function.prototype.MyCall = function(ctx = window) {
  const args = [...arguments].slice(1);
  const tempFn = Symbol();
  ctx[tempFn] = this;
  const result = ctx[tempFn](...args);
  delete ctx[tempFn];
  return result;
};

Function.prototype.MyBind1 = function(ctx = window) {
  const self = this;
  const args = [...arguments].slice(1);
  return function (..._args) {
    self.MyCall(ctx, ...args, ..._args);
  };
};

