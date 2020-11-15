const shopCar = (function() {
  const list = []
  let ins
  return function() {
    if (!ins) {
      ins = {
        addGoods(goods) {
          list.push(goods)
        },
        removeGoods(goods) {
          const _index = list.findIndex(_goods => _goods === goods)
          if (_index > -1) {
            list.splice(_index, 1)
          }
        },
        getGoods() {
          console.log('list:', list)
        }
      }
    }
    return ins
  }
})()