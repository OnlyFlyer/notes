export class SinpleClass {
  constructor() {
    if (!SinpleClass.instance) {
      this.list = []
      SinpleClass.instance = this
    }
    return SinpleClass.instance
  }

  addGoods(goods) {
    this.list.push(goods)
  }

  removeGoods(goods) {
    const { list = [] } = this
    const _index = list.find(_goods => _goods === goods)
    if (_index > -1) {
      this.list.splice(_index, 1)
    }
  }

  getGoods() {
    console.log(this.list)
    return this.list
  }
}