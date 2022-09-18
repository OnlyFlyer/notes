class subscribe {
  constructor() {
    if (!subscribe.ins) {
      this.bucket = {}
      subscribe.ins = this
    }
    return subscribe.ins
  }

  listen(type, fn) {
    if (!type || !fn) return false
    if (!this.bucket[type]) {
      this.bucket[type] = []
    }
    this.bucket[type].push(fn)
  }

  trigger(type, ...rest) {
    const _bool = Object.keys(this.bucket).includes(type)
    if (!_bool) return false
    for (const index in this.bucket[type]) {
      // this.bucket[type][index].apply(this, rest)
      this.bucket[type][index].call(this, ...rest)
    }
  }

  remove(type, fn) {
    if (!type || !fn) return false
    const _bool = Object.keys(this.bucket).includes(type)
    if (!_bool) return false
    for (const index in this.bucket[type]) {
      if (this.bucket[type][index] === fn) {
        this.bucket[type].splice(index, 1)
      }
    }
  }
}
