const _subscribe = (function() {
  const bucket = {}
  const listen = function(type, fn) {
    if (!bucket[type]) {
      bucket[type] = []
    }
    bucket[type].push(fn)
  }
  const trigger = function(type, ...rest) {
    const _bool = Object.keys(bucket).includes(type)
    if (_bool) {
      for (const index in bucket[type]) {
        // bucket[type][index].apply(this, rest)
        bucket[type][index].call(this, ...rest)
      }
    }
  }
  const remove = function(type, fn) {
    if (!type || !fn) return false
    const fnsArr = bucket[type]
    if (!fnsArr) return false
    for (const index in fnsArr) {
      if (fnsArr[index] === fn) {
        fnsArr.splice(index, 1)
      }
    }
  }
  return {
    listen,
    trigger,
    remove
  }
})()
