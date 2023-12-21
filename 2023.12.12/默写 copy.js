
// enum PromiseStatus {
//   pending = 'pending',
//   fulfilled = 'fulfilled',
//   rejected = 'rejected',
// };

class MyPromise {
  // promiseStatus;
  // promiseResult;
  constructor(executor) {
    this.initialValue();
    this.initialBind();
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  initialBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  };
  initialValue() {
    this.promiseStatus = 'pending';
    this.promiseResult = null;
    this.onFulfilledCallback = []; // 异步成功之后的回调
    this.onRejectedCallback = []; // 异步失败之后的回调
  };
  resolve(value) {
    if (this.promiseStatus !== 'pending') return;
    this.promiseResult = value;
    this.promiseStatus = 'fulfilled';
    while (this.onFulfilledCallback.length) {
      const successCb = this.onFulfilledCallback.shift();
      successCb(this.promiseResult);
    }
  }
  reject(reason) {
    if (this.promiseStatus !== 'pending') return;
    this.promiseResult = reason;
    this.promiseStatus = 'rejected';
    while (this.onRejectedCallback.length) {
      const failCb = this.onRejectedCallback.shift();
      failCb(this.promiseResult);
    }
  }
  then(successCallback, failCallback) {
    successCallback = typeof successCallback === 'function' ? successCallback : val => val;
    failCallback = typeof failCallback === 'function' ? failCallback : reason => { throw new Error(reason) };
    const thenPromise = new MyPromise((resolve, reject) => {
      function promiseExecutor(cb) {
        queueMicrotask(() => {
          try {
            const result = cb(this.promiseResult);
            if (result && result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            };
          } catch(e) {
            reject(e);
          }
        });
      };
      if (this.promiseStatus === 'fulfilled') {
        promiseExecutor(successCallback);
        // successCallback(this.promiseResult);
      } else if (this.promiseStatus === 'rejected') {
        promiseExecutor(failCallback);
        // failCallback(this.promiseResult);
      } else if (this.promiseStatus === 'pending') {
        this.onFulfilledCallback.push(promiseExecutor.bind(this, successCallback));
        this.onRejectedCallback.push(promiseExecutor.bind(this, failCallback));
      }
    });
    return thenPromise;
  };
  catch(failCallback) {
    return this.then(null, failCallback);
  }
  // 还不明白
  finally(endCallback) {
    return this.then(
      (val) => {
        return MyPromise.resolve(endCallback()).then(() => val)
      },
      (reason) => {
        return MyPromise.resolve(endCallback()).then(() => { throw new Error(reason) })
      });
  }
  // 1. 接收一个 Promise list
  // 2. 全部成功，才成功，有一个失败就算失败
  all(promises) {
    const len = promises.length;
    let count = 0;
    let result = [];
    function addResult(value, index, resolve) {
      result[index] = value;
      count++;
      if (count === len) {
        resolve(result);
      }
    };
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then((res) => {
            addResult(res, index, resolve);
          }, (err) => {
            reject(err);
          });
        } else {
          addResult(promise, index, resolve);
        }
      });
    });
  }
  // 谁最快返回谁，直接遍历
  race(promises) {
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
  allSettled(promises) {
    const len = promises.length;
    let count = 0;
    let result = [];
    function addResult(value, index, resolve) {
      result[index] = value;
      count++;
      if (count === len) {
        resolve(result);
      }
    };
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(resolve, resolve);
        } else {
          addResult(promise, index, resolve);
        }
      });
    });
  };
  // 1. 任意一个成功就算成功，直接返回该结果
  // 2. 所有失败才失败，此时返回 err list
  any(promises) {
    const len = promises.length;
    let count = 0;
    let result = [];
    function addReject(reason, index, reject) {
      result[index] = reason;
      count++;
      if (count === len) {
        reject(result);
      }
    }
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then((val) => {
            resolve(val);
          }, (err) => {
            addReject(err, index, reject);
          });
        } else {
          resolve(promise);
        }
      });
    });
  }
};


// 1. 初始化时状态为 pending
// 2. 状态不可逆， 只能是 pending -> rejected / fulfilled
const p = new MyPromise((resolve, reject) => {});

const a = new Promise();

a.finally(() => {
  console.log('--end');
})

// 实现 Scheduler

class Scheduler {
  constructor(limit) {
    this.limit = limit; // 最大并行任务数量
    this.taskQueue = []; // 任务队列 Array<{ promise, resolve, reject }>
    this.runningTaskNum = 0; // 运行中的任务数量
  }
  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ promise: promiseCreator, resolve, reject });
      this.run();
    });
  };
  run() {
    if (this.runningTaskNum < this.limit && this.taskQueue.length) {
      this.runningTaskNum += 1;
      const { promise, resolve, reject } = this.taskQueue.shift();
      const res = promise();
      if (res instanceof Promise) {
        res
          .then(resolve, reject)
          .finally(() => {
            this.runningTaskNum -= 1;
            this.run();
          });
      } else {
        this.runningTaskNum -= 1;
        this.run();
        resolve(res);
      }
    }
  };
};


const s = new Scheduler(2);

