
class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';
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
    this.promiseStatus = MyPromise.PENDING;
    this.promiseResult = null;
    this.promiseFulfilledCallback = [];
    this.promiseRejectedCallback = [];
  };
  resolve = (result) => {
    if (this.promiseStatus !== MyPromise.PENDING) return;
    this.promiseStatus = MyPromise.FULFILLED;
    this.promiseResult = result;
    while (this.promiseFulfilledCallback.length) {
      const cb = this.promiseFulfilledCallback.shift();
      cb(this.promiseResult);
    }
  };
  reject = (reason) => {
    if (this.promiseStatus !== MyPromise.PENDING) return;
    this.promiseStatus = MyPromise.REJECTED;
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
    return new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        try {
          const res = cb(this.promiseResult);
          if (res instanceof MyPromise) {
            res.then(resolve, reject);
          } else {
            resolve(res);
          }
        } catch (err) {
          reject(err);
        }
      };
      if (this.promiseStatus === MyPromise.FULFILLED) {
        resolvePromise(onFulfilled);
        // onFulfilled(this.promiseResult);
      } else if (this.promiseStatus === MyPromise.REJECTED) {
        resolvePromise(onRejected);
        // onRejected(this.promiseResult);
      } else if (this.promiseStatus === MyPromise.PENDING) {
        this.promiseFulfilledCallback.push(resolvePromise.bind(this, onFulfilled));
        this.promiseRejectedCallback.push(resolvePromise.bind(this, onRejected));
      };
    });
  };
  catch = (onRejected) => {
    return this.then(null, onRejected);
  };
  finally = (endCallback) => {
    return this.then(
      (val) => {
        // 为什么要使用 resolve 执行 endCallback，之后再继续执行 then，返回结果？
        // 因为如果 endCallback 如果是个异步任务，则需要等 endCallback 执行完后再返回数据，即
        // 在 finally 后面再跟 .then 仍然要获取到值，因此需要传递下去
        return MyPromise.resolve(endCallback()).then(() => val);
      },
      (reason) => {
        return MyPromise.resolve(endCallback()).then(() => { throw new Error(reason) });
      },
    );
  };
  // 1. 接收一个 promise list
  // 2. 全部成功，才成功，返回所有的值，又一个失败就失败，返回失败的那个
  all = (promises = []) => {
    let count = 0;
    let result = [];
    function addResult(val, index, resolve) {
      result[index] = val;
      count++;
      if (count === promises.length) {
        resolve(result);
      }
    };
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (val) => {
              addResult(val, index, resolve);
            },
            (reason) => {
              reject(reason);
            }
          );
        } else {
          addResult(promise, index, resolve);
        }
      });
    });
  };
  // 谁最快返回谁
  race = (promises = []) => {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(resolve, reject);
        } else {
          resolve(promise);
        }
      });
    });
  };
  // 当所有 promise 执行完后，生成一个 Array<{ status, value, reason }> 的数组
  allSettled = (promises = []) => {
    let count = 0;
    let result = [];
    return new MyPromise((resolve, reject) => {
      function addResult(res, index, status) {
        count++;
        const extra = status === MyPromise.FULFILLED
          ? { value: res }
          : status === MyPromise.REJECTED
            ? { reason: res }
            : {};
        result[index] = { status, ...extra };
        if (count === promises.length) {
          resolve(result);
        }
      };
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (val) => {
              addResult(val, index, MyPromise.FULFILLED);
            },
            (reason) => {
              addResult(reason, index, MyPromise.REJECTED);
            },
          );
        } else {
          addResult(promise, index, MyPromise.FULFILLED);
        };
      });
    });
  };
  // 1. 任意一个成功就算成功，直接返回结果
  // 2. 所有失败才算失败，此时返回 err list
  any = (promises = []) => {
    let count = 0;
    let errorList = [];
    return new MyPromise((resolve, reject) => {
      function addError(reason, index) {
        errorList[index] = reason;
        if (++count === promises.length) {
          reject(errorList);
        }
      };
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then((value) => {
            resolve(value);
          }, (reason) => {
            addError(reason, index);
          });
        } else {
          resolve(promise);
        }
      });
    });
  };
};

var a = new MyPromise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    resolve(1);
  }, 2000);
}).then(res => {
  console.log(res, '--第一个then');
  return res + 1;
}, err => err).then((res) => { console.log(res, '--第二个then'); }, (err) => { console.log(err, '--失败'); });

// 针对 promise 分析
// 1. 有 pending、fulfilled、rejected 三种状态，默认为 pending，且状态不可逆，只能从 pending -> resolve or pending -> reject
// 2. promise 支持传入一个执行器，执行期参数为 resolve、reject，分别代表成功和失败的回调

// 针对 then 分析
// 1. then 回调有两个， 一个 successCb，一个 failCb
// 2. Promise fulfilled 走 successCb， rejected 走 failCb
// 3. 上一次的链式调用会影响后续的执行逻辑
// 4. 需要考虑定时器、异步的情况，在 then 中 要往 successCb 和 failCb 数组中 push


// 函数式实现
function MyPromise(executor) {
  this.promiseResult = null;
  this.promiseStatus = MyPromise.PENDING;
  this.promiseFulfilledCallbacks = [];
  this.promiseRejectedCallbacks = [];
  function resolve(result) {
    if (this.promiseStatus !== MyPromise.PENDING) return;
    this.promiseStatus = MyPromise.FULFILLED;
    this.promiseResult = result;
    while (this.promiseFulfilledCallbacks.length) {
      const cb = this.promiseFulfilledCallbacks.shift();
      cb(this.promiseResult);
    }
  }
  function reject(reason) {
    if (this.promiseStatus !== MyPromise.PENDING) return;
    this.promiseStatus = MyPromise.REJECTED;
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
MyPromise.prototype.then = function(thenResolve, thenReject) {
  thenResolve = typeof thenResolve === 'function'
    ? thenResolve
    : (val) => val;
    thenReject = typeof thenReject === 'function'
    ? thenReject
    : (reason) => {
      throw new Error(reason);
    };
  const thenPromise = new MyPromise((resolve, reject) => {
    function resolvePromise(cb) {
      queueMicrotask(() => {
        try {
          const result = cb(this.promiseResult);
          if (result === thenPromise) {
            throw new Error('not return self');
          }
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(err);
          throw new Error(err);
        }
      });
    };
    if (this.promiseStatus === MyPromise.FULFILLED) {
      resolvePromise(thenResolve.bind(this));
      // thenResolve(this.promiseResult);
    } else if (this.promiseStatus === MyPromise.REJECTED) {
      // thenReject(this.promiseResult);
      resolvePromise(thenReject.bind(this));
    } else if (this.promiseStatus === MyPromise.PENDING) {
      // 异步、或者 空 promise
      this.promiseFulfilledCallbacks.push(resolvePromise.bind(this, thenResolve));
      this.promiseRejectedCallbacks.push(resolvePromise.bind(this, thenReject));
    }
  });
  return thenPromise;
};
// var fn = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     reject(1);
//   }, 3000);
// }).then((res) => { console.log(res, '--res'); }, (err) => { console.log(err, '--err'); });

// 执行测试用例需要用到的代码
MyPromise.deferred = function() {
  let defer = {};
  defer.promise = new MyPromise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
}

module.exports = MyPromise;
