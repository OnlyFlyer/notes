var subscribe = {}
subscribe.bucket = {}

// 增加订阅
subscribe.listen = function(type, fn) {
  if (!this.bucket[type]) {
    this.bucket[type] = []
  }
  this.bucket[type].push(fn)
}

// 触发发布
subscribe.trigger = function(type, ...rest) {
  const _bool = Object.keys(this.bucket).includes(type)
  if (_bool) {
    for (const index in this.bucket[type]) {
      this.bucket[type][index].apply(this, rest)
    }
  }
}
