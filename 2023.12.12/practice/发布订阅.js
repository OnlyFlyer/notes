class subscribe {
  constructor() {
    this.bucket = {}
  };
  listen(key, cb) {
    if (!key && !cb) return false;
    if (!this.bucket[key]) {
      this.bucket[key] = [];
    }
    this.bucket[key].push(cb);
  };
  trigger(key) {
    if (!this.bucket[key]) return false;
    const args = [...arguments].slice(1);
    for (const index in this.bucket[key]) {
      this.bucket[key][index].call(this, ...args);
    }
  };
  remove(key, cb) {
    if (!key) return false;
    if (this.bucket[key]) {
      for (const index in this.bucket[key]) {
        if (this.bucket[key][index === cb]) {
          this.bucket[key].splice(index, 1);
        }
      }
    }
  };
};
