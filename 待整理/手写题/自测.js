// 防抖和节流

// 防抖, 多次点击只执行一次，有两种方式，一种是多次点击，只执行第一次，一种是多次点击，只执行最后一次

// 1. 多次点击，只执行最后一次

function debounce(fn, delay = 200) {
  let timer = null
  return function () {
    const that = this
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(that, arguments)
    }, delay)
  }
}

// 2. 多次点击，只执行第一次

function debounce1 (fn, delay) {
  let timer = null
  return function () {
    const that = this
    const now = !timer
    if (now) {
      fn.apply(that, arguments)
    }
    timer = setTimeout(function(){
      timer = null
    }, delay)
  }
}

// 3. 合并
function debounce (fn, delay, hasImmediately = false) {
  let timer = null
  return function () {
    const that = this
    clearTimeout(timer)
    if (hasImmediately) {
      const now = !timer
      if (now) {
        fn.apply(that, arguments)
      }
      timer = setTimeout(function () {
        timer = null
      }, delay)
    } else {
      timer = setTimeout(function () {
        fn.apply(that, arguments)
      }, delay)
    }
  }
}

// 节流，多次点击，只会在相等的时间间隔处执行，也有两种方式，一种时间戳，一种定时器

// 时间戳
function throttle(fn, duration = 200) {
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
function throttle(fn, duration = 200) {
  let timer = null
  return function () {
    const that = this
    if (timer) return
    timer = setTimeout(function () {
      fn.apply(that, arguments)
      timer = null
    }, duration)
  }
}
