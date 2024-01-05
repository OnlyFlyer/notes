// 保证同时运行的任务最多有 N 个，完善下面的 Scheduler 类，使得以下程序能够正常输出
class Scheduler {
  add(promiseCreator) {}
}

const timeout = (time) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

const scheduler = new Scheduler(N);
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
}

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

// 打印顺序： 2、3、1、4


// 测试1
class SchedulerDemo {
  constructor(limit) {
    this.limit = limit;
    this.runningTaskNum = 0;
    this.taskQueue = []; // 任务、resolve、reject Array<{ promise, resolve, reject }>
  };
  add(promiseCreator) {
    const addResult = new Promise((resolve, reject) => {
      this.taskQueue.push({ promise: promiseCreator, resolve, reject });
      this.run();
    });
    return addResult;
  }
  run = () => {
    if (this.runningTaskNum < 2 && this.taskQueue.length) {
      const { promise, resolve, reject } = this.taskQueue.shift();
      this.runningTaskNum += 1;
      const x = promise();
      if (x instanceof Promise) {
        x.then(resolve, reject).finally(() => {
          this.runningTaskNum -= 1;
          this.run();
        });
      } else {
        this.runningTaskNum -= 1;
        this.run();
        resolve(x);
      }
    }
  };
}
