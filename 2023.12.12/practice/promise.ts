const PromisePending = 'pending';
const PromiseFulfilled = 'fulfilled';
const PromiseRejected = 'rejected';

class MyPromiseClass {
  promiseStatus;
  promiseResult;
  promiseFulfilledCallback;
  promiseRejectedCallback;
  constructor(executor) {
    this.bindInitialValue();
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
      throw new Error(err);
    }
  }
  bindInitialValue () {
    this.promiseStatus = PromisePending;
    this.promiseResult = null;
    this.promiseFulfilledCallback = [];
    this.promiseRejectedCallback = [];
  };
  resolve = (result) => {
    if (this.promiseStatus !== PromisePending) return;
    this.promiseStatus = PromiseFulfilled;
    this.promiseResult = result;
    while (this.promiseFulfilledCallback.length) {
      const cb = this.promiseFulfilledCallback.shift();
      cb(this.promiseResult);
    }
  };
  reject = (reason) => {
    if (this.promiseStatus !== PromisePending) return;
    this.promiseStatus = PromiseRejected;
    this.promiseResult = reason;
    while (this.promiseRejectedCallback.length) {
      const cb = this.promiseRejectedCallback.shift();
      cb(this.promiseResult);
    }
  };

  then = (onFulfilled, onRejected) => {
    onFulfilled = typeof onFulfilled === 'function'
      ? onFulfilled
      : (val) => val;
    onRejected = typeof onRejected === 'function'
      ? onRejected
      : (err) => { throw new Error(err) };
    return new MyPromiseClass((resolve, reject) => {
      const resolvePromise = (cb) => {
        try {
          const res = cb(this.promiseResult);
          if (res instanceof MyPromiseClass) {
            res.then(resolve, reject);
          } else {
            resolve(res);
          }
        } catch (err) {
          reject(err);
        }
      };
      if (this.promiseStatus === PromiseFulfilled) {
        resolvePromise(onFulfilled);
        // onFulfilled(this.promiseResult);
      } else if (this.promiseStatus === PromiseRejected) {
        resolvePromise(onRejected);
        // onRejected(this.promiseResult);
      } else if (this.promiseStatus === PromisePending) {
        this.promiseFulfilledCallback.push(resolvePromise.bind(this, onFulfilled));
        this.promiseRejectedCallback.push(resolvePromise.bind(this, onRejected));
      };
    });
  };
};

var a = new MyPromiseClass((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    resolve(1);
  }, 2000);
}).then(res => {
  console.log(res, '--第一个then');
  return res + 1;
}, err => err).then((res) => { console.log(res, '--第二个then'); }, (err) => { console.log(err, '--失败'); });;

// 针对 promise 分析
// 1. 有 pending、fulfilled、rejected 三种状态，默认为 pending，且状态不可逆，只能从 pending -> resolve or pending -> reject
// 2. promise 支持传入一个执行器，执行期参数为 resolve、reject，分别代表成功和失败的回调

// 针对 then 分析
// 1. then 回调有两个， 一个 successCb，一个 failCb
// 2. Promise fulfilled 走 successCb， rejected 走 failCb
// 3. 上一次的链式调用会影响后续的执行逻辑
// 4. 需要考虑定时器、异步的情况，在 then 中 要往 successCb 和 failCb 数组中 push

// 函数式实现
function MyPromiseFn(executor) {
  this.promiseResult = null;
  this.promiseStatus = PromisePending;
  this.promiseFulfilledCallbacks = [];
  this.promiseRejectedCallbacks = [];
  function resolve(result) {
    if (this.promiseStatus !== PromisePending) return;
    console.log(this, '--106');
    this.promiseStatus = PromiseFulfilled;
    this.promiseResult = result;
    while (this.promiseFulfilledCallbacks.length) {
      const cb = this.promiseFulfilledCallbacks.shift();
      cb(this.promiseResult);
    }
  }
  function reject(reason) {
    if (this.promiseStatus !== PromisePending) return;
    console.log(this, '--116');
    this.promiseStatus = PromiseRejected;
    this.promiseResult = reason;
    while (this.promiseRejectedCallbacks.length) {
      const cb = this.promiseRejectedCallbacks.shift();
      cb(this.promiseResult);
    }
  }
  try {
    executor(resolve.bind(this), reject.bind(this));
  } catch (err) {
    reject(err);
    throw new Error(err);
  }
};
MyPromiseFn.prototype.then = function(thenResolve, thenReject) {
  thenResolve = typeof thenResolve === 'function'
    ? thenResolve
    : (val) => val;
    thenReject = typeof thenReject === 'function'
    ? thenReject
    : (reason) => {
      throw new Error(reason);
    };
  return new MyPromiseFn((resolve, reject) => {
    console.log(this.promiseStatus, '--141');
    function resolvePromise(cb) {
      try {
        const result = cb(this.promiseResult);
        console.log(result instanceof MyPromiseFn, '--144');
        if (result instanceof MyPromiseFn) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
        throw new Error(err);
      }
    };
    if (this.promiseStatus === PromiseFulfilled) {
      resolvePromise(thenResolve);
      // thenResolve(this.promiseResult);
    } else if (this.promiseStatus === PromiseRejected) {
      // thenReject(this.promiseResult);
      resolvePromise(thenReject);
    } else if (this.promiseStatus === PromisePending) {
      // 异步、或者 空 promise
      this.promiseFulfilledCallbacks.push(thenResolve);
      this.promiseRejectedCallbacks.push(thenReject);
    }
  });
};
var fn = new MyPromiseFn((resolve, reject) => {
  setTimeout(() => {
    reject(1);
  }, 3000);
}).then((res) => { console.log(res, '--res'); }, (err) => { console.log(err, '--err'); });

