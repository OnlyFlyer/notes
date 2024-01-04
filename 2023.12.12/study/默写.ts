
enum PromiseStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
};

class MyPromise {
  promiseStatus: PromiseStatus;
  promiseResult: any;
  constructor(executor) {
    this.initialValue();
    executor(this.resolve, this.reject);
  }
  initialValue() {
    this.promiseStatus = PromiseStatus.pending;
    this.promiseResult = null;
  };
  resolve(value) {
    if (this.promiseStatus !== PromiseStatus.pending) return;
    this.promiseResult = value;
    this.promiseStatus = PromiseStatus.fulfilled;
  }
  reject(reason) {
    if (this.promiseStatus !== PromiseStatus.pending) return;
    this.promiseResult = reason;
    this.promiseStatus = PromiseStatus.rejected;
  }
};


// 1. 初始化时状态为 pending
// 2. 状态不可逆， 只能是 pending -> rejected / fulfilled
const p = new MyPromise((resolve, reject) => {});
