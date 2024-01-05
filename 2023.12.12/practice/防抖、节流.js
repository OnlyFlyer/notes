
// 防抖 最后执行
function debounce(fn, delay = 200) {
  let timer = null;
  return function() {
    const self = this;
    const args = [...arguments];
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(self, args);
    }, delay);
  };
};

// 防抖 可控制最开始执行还是最后执行
function debounce(fn, delay = 200, hasImmediate){
  let timer = null;
  return function() {
    const self = this;
    if (timer) clearTimeout(timer);
    if (hasImmediate) {
      const doNow = !timer;
      timer = setTimeout(function() {
        timer = null;
      }, delay);
      if (doNow) {
        fn.apply(self, [...arguments]);
      }
    } else {
      timer = setTimeout(function() {
        fn.apply(self, [...arguments]);
      }, delay);
    }
  };
};

// 应用场景如：输入框的联想，可以限定用户在输入时，只在每两秒钟响应一次联想。

// 节流 时间戳
function throttle(fn, duration) {
  let timestamp = Date.now();
  return function() {
    if (Date.now() - timestamp > duration) {
      timestamp = Date.now();
      fn.apply(this, [...arguments]);
    }
  };
};

function throttle(fn, duration) {
  let timer = null;
  return function() {
    const self = this;
    const args = [...arguments];
    if (timer === null) {
      timer = setTimeout(() => {
        fn.apply(self, args);
        timer = null;
      }, duration);
    }
  };
};
