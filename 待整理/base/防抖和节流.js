// 浏览器在 resize、scroll、keypress、mousemove 的时候会频繁的调用绑定的事件函数
// 极大的浪费资源和消耗性能

// 防抖(debounce): 短时间内多次触发同一个函数，只执行最后一次，或者只是开始的时候执行

// 最后执行
function debounce (fn, delay = 200) {
  let timer = null
  return function () {
    const that = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.call(that, ...args)
    }, delay)
  }
}

// 开始执行
function debounce(fn, delay = 200, hasImmediate) {
  let timer = null
  return function () {
    const that = this
    if (timer) clearTimeout(timer)
    if (!!hasImmediate) {
      const doNow = !timer
      timer = setTimeout(function () {
        timer = null
      }, delay)
      if (doNow) {
        fn.apply(that, arguments)
      }
    } else {
      timer = setTimeout(function () {
        fn.apply(that, arguments)
      }, delay)
    }
  }
}

// 节流(throttle) 在一段时间内只允许函数执行一次

// 应用场景如：输入框的联想，可以限定用户在输入时，只在每两秒钟响应一次联想。

// 时间戳
function throttle(fn, duration = 1000) {
  let lastTime = null
  return function () {
    const that = this
    if (!lastTime) {
      fn.apply(that, arguments)
      lastTime = Date.now()
    } else {
      const now = Date.now()
      if (now - lastTime >= duration) {
        fn.apply(that, arguments)
        lastTime = now
      }
    }
  }
}

// 定时器
function throttle(fn, duration = 1000) {
  let timer = null
  return function () {
    const that = this
    if (!timer) {
      timer = setTimeout(function () {
        fn.apply(that, arguments)
        timer = null
      }, duration)
    }
  }
}
