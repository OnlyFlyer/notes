class Singleton {
  constructor() {
    if (!Singleton.instance) {
      this.list = [];
      Singleton.instance = this;
    }
    return Singleton.instance;
  };
  add(num) {
    this.list.push(num);
  };
  remove(num) {
    const _index = this.list.findIndex((_num) => _num === num);
    if (_index > -1) {
      this.list.splice(_index, 1);
    }
  };
  getNum() {
    console.log(this.list);
    return this.list;
  };
};

const Singleton = (function() {
  let list = [];
  let instance;
  return function() {
    if (!instance) {
      instance = {
        list,
        add: (num) => {
          list.push(num);
        },
        remove: (num) => {
          const _index = list.findIndex(_num => _num === num);
          if (_index > -1) {
            list.splice(_index, 1);
          }
        },
        getNum: () => {
          console.log(list);
          return list;
        },
      };
    };
    return instance;
  }
})();
