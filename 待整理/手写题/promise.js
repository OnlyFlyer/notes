new Promise((reolve, reject) => {

})

class MyPromise {
  static PENDING = 'pending';
  static REJECTED = 'rejected';
  static RESOLVED = 'fulfilled';
  constructor(fn) {
    this.state = MyPromise.PENDING;
    this.val = null;
    this.onFulfilledCallback = [];
    this.onRejectedCallback = [];
    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject(err);
    }
  }
  resolve(value) {
    if (this.state === MyPromise.PENDING) {
      setTimeout(() => {
        this.state = MyPromise.RESOLVED;
        this.val = value;
        this.onFulfilledCallback.forEach(cb => {
          cb(value);
        })
      })
    }
  };
  reject(err) {
    if (this.state === MyPromise.PENDING) {
      setTimeout(() => {
        this.state = MyPromise.REJECTED;
        this.val = err;
        this.onRejectedCallback.forEach(cb => {
          cb(err);
        })
      })
    }
  };
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally (cb){
    return this.then(cb, cb);
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};
    function resolvePromise(p, x, s, f) {
      if (x === p) {
        return reject('x 不允许与返回的 promise 相等，会引发循环引用');
      }
      if (x instanceof MyPromise) {
        if (x.state === MyPromise.PENDING) {
          x.then(y => {
            resolvePromise(x, y, s, f);
          }, reject);
        }
        if (x.state === MyPromise.RESOLVED) {
          s(x.val)
        }
        if (x.state === MyPromise.REJECTED) {
          f(x.val)
        }
      }
      if (x !== null && ['object', 'function'].includes(typeof x)) {
        var then;
        try {
          then = x.then;
        } catch (err) {
          f(err);
        }
        if (typeof then === 'function') {
          let called = false;
          try {
            then.call(x, (successRes) => {
              if (called) return;
              called = true;
              resolvePromise(p, successRes, s, f);
            }, (failRes) => {
              if (called) return;
              called = true;
              f(failRes);
            });
          } catch(err) {
            if (called) return;
            called = true;
            f(err);
          }
        } else {
          s(x)
        }
      } else {
        s(x);
      }
    }
    const returnPromise = new MyPromise((resolve, reject) => {
      if (this.state === MyPromise.PENDING) {
        this.onFulfilledCallback.push(() => {
          try {
            const x = onFulfilled(this.val);
            resolvePromise(returnPromise, x, resolve, reject)
          } catch(err) {
            reject(err);
          }
        });
        this.onRejectedCallback.push(() => {
          try {
            const x = onRejected(this.val);
            resolvePromise(returnPromise, x, resolve, reject);
          } catch(err) {
            reject(err);
          }
        });
      }
      if (this.state === MyPromise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.val);
            resolvePromise(returnPromise, x, resolve, reject)
          } catch (err) {
            reject(err);
          }
        })
      }
      if (this.state === MyPromise.RESOLVED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.val)
            resolvePromise(returnPromise, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
    })
    return returnPromise;
  };
}

MyPromise.resolve = function(val) {
  if(val instanceof MyPromise) return val;
  if (val instanceof Object && 'then' in val) {
    return new MyPromise((resolve, reject) => {
      // 不需要 catch，MyPromise 内部会捕获错误
      val.then(resolve, reject);
    })
  }
  return new MyPromise((resolve) => {
    resolve(val);
  })
}
MyPromise.reject = function(reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  })
}
MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new Error('入参不是一个可迭代对象'));
    } else {
      if (promises.length === 0) {
        resolve(promises);
      }
      let result = [];
      let count = 0;
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise || (promise instanceof Object && 'then' in promise)) {
          promise.resolve(promise).then(val => {
            count++;
            result[index] = val;
            if (count === promises.length) {
              resolve(result);
            }
          }, reason => {
            reject(reason);
          })
        } else {
          count++;
          result[index] = promise;
          if (count === promises.length) {
            resolve(result);
          }
        }
      })
    }
  })
}

MyPromise.allSettled = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      reject(new Error('input type err，must be a Iterator type!'));
    } else {
      let result = [];
      let count = 0;
      promises.forEach((item, index) => {
        MyPromise.resolve(item).then((val) => {
          result[index] = {
            value: val,
            status: MyPromise.RESOLVED,
          };
          count++;
          if (count === promises.length) {
            resolve(result);
          }
        }, (reason) => {
          result[index] = {
            value: reason,
            status: MyPromise.REJECTED,
          };
          count++;
          if (count === promises.length) {
            resolve(result);
          }
        })
      })
    }
  });
}

MyPromise.any = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      reject(new Error('input type error,must be a Iterator type!'));
    } else {
      if (!promises.length) {
        resolve([]);
      }
      let count = 0;
      let errors = [];
      promises.forEach((item, index) => {
        MyPromise.resolve(item).then((val) => {
          resolve(val);
        }, (reason) => {
          count++;
          errors.push(reason);
          if (count === promises.length) {
            reject(new AggregateError(errors));
          }
        })
      })
    }
  });
}

MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      reject(new Error('Argument is not a iterator!'));
    } else {
      if (promises.length) {
        promises.forEach((item, index) => {
          MyPromise.resolve(item).then(resolve, reject)
        })
      }
    }
  })
}

// 为了单元测试
MyPromise.deferred = function() {
  let resolve = null;
  let reject = null;
  const promise = new MyPromise((succ, fail) => {
    resolve = succ;
    reject = fail;
  })
  return {
    promise,
    resolve,
    reject,
  }
}

class MinePromise {
  static PENDING = 'pending';
  static RESOLVED = 'fulfilled';
  static REJECTED = 'rejected';
  constructor(fn) {
    this.state = MinePromise.PENDING;
    this.val = null;
    this.onFulfilledCallback = [];
    this.onRejectedCallback = [];
    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject(err);
    }
  }
  resolve(val) {
    if (this.state === MinePromise.PENDING) {
      setTimeout(() => {
        this.state = MinePromise.RESOLVED;
        this.val = val;
        this.onFulfilledCallback.forEach((fn) => {
          fn(this.val);
        })
      })
    }
  }
  reject(err) {
    if (this.state === MinePromise.PENDING) {
      setTimeout(() => {
        this.state = MinePromise.REJECTED;
        this.val = err;
        this.onRejectedCallback((fn) => {
          fn(this.val);
        })
      })
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};
    function resolvePromise(p, x, resolve, reject) {
      if (x instanceof p) {
        reject(new Error('循环引用'));
      }
      if (x instanceof MinePromise) {
        if (x.state === MinePromise.REJECTED) {
          reject(x.val);
        }
        if (x.state === MinePromise.RESOLVED) {
          resolve(x.val);
        }
        if (x.state === MinePromise.PENDING) {
          x.then((y) => {
            resolvePromise(x, y, resolve, reject);
          }, reject);
        }
      }
      if (x !== null && ['function', 'object'].includes(typeof x)) {
        let then;
        try {
          then = x.then;
        } catch(e) {
          reject(e);
        }
        if (typeof then === 'function') {
          then.call(x, (succRes) => {
            resolvePromise(x, succRes, resolve, reject);
          }, (failReason) => {
            reject(failReason);
          });
        } else {
          resolve(x);
        }
      } else {
        resolve(x);
      }
    }
    const promise = new MinePromise((resolve, reject) => {
      if (this.state === MinePromise.RESOLVED) {
        setTimeout(() => {
          try {
            const res = onFulfilled(this.val);
            resolvePromise(promise, res, resolve, reject);
          } catch (err) {
            reject(err);
          }
        })
      }
      if (this.state === MinePromise.REJECTED) {
        setTimeout(() => {
          try {
            const err = onRejected(this.val);
            resolvePromise(promise, err, resolve, reject);
          } catch (e) {
            reject(e);
          }
        })
      }
      if (this.state === MinePromise.PENDING) {
        this.onFulfilledCallback.push(() => {
          setTimeout(() => {
            try {
              const res = onFulfilled(this.val);
              resolvePromise(promise, res, resolve, reject);
            } catch (err) {
              reject(err);
            }
          })
        });
        this.onRejectedCallback.push(() => {
          setTimeout(() => {
            try {
              const err = onRejected(this.val);
              resolvePromise(promise, err, resolve, reject);
            } catch(e) {
              reject(e);
            }
          })
        });
      }
    });
    return promise;
  }
}
