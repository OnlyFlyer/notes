// 实现一个 MyBind 方法使得功能与 bind 保持一致
Function.prototype.MyBind = function(ctx) {
  const _ctx = ctx || window;
  const args1 = [...arguments].slice(1);
  const tempFn = Symbol();
  _ctx[tempFn] = this;
  return function(...args) {
    const result = _ctx[tempFn](...args1, ...args);
    delete _ctx[tempFn];
    return result;
  };
};

Function.prototype.MyBind1 = function(ctx) {
  const self = this;
  const args1 = [...arguments].slice(1);
  return function() {
    const args2 = [...arguments];
    return self.call(ctx, ...args1, ...args2);
  };
};

// 实现一个 MyApply 方法使得功能与 apply 保持一致
Function.prototype.MyApply = function(ctx, args) {
  const tempFn = Symbol();
  ctx[tempFn] = this;
  const result = ctx[tempFn](...args);
  delete ctx[tempFn];
  return result;
};

// 实现一个 MyCall 方法使得功能与 call 保持一致
Function.prototype.MyCall = function(ctx) {
  const args = [...arguments].slice(1);
  const tempFn = Symbol();
  ctx[tempFn] = this;
  const result = ctx[tempFn](...args);
  delete ctx[tempFn];
  return result;
};

const a = {
  foo: 1,
  sayHello: function(n) {
    console.log(this.foo, n, '--10');
  },
};
