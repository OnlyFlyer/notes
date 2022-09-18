function deepClone(obj) {
  if (obj === null) return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  let cloneObj = new obj.constructor();
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key]);
    }
  }
  return cloneObj;
}


let a ={num:1}
let b = a
a={num:2}
console.log(b) //{num:1} 为什么？

// b = a 后 b 也指向 a 的地址，当进行 a={num:2}赋值操作 相当于
// 重新为 a 分配了地址，b 没变，还指向之前的内存地址，所以有变化

// 浅拷贝的方式

// Object.assign
// lodash的 _.clone
// 展开运算符号 ...
// 数组的 concat、slice 等


// 深拷贝的方式

// JSON.parse(JSON.stringfy(obj))
// deepClone
// lodash 的 _.cloneDeep


// JSON.stringify 

// 在格式化 函数 等时会丢失函数类型的属性，可以用 JSON.stringify 的第二个参数解决该问题

const cc = {
  a: 1,
  b: [1,2,3,4,5,6],
  c: {a: 9, b: 8, c: 7},
  d: test,
}
function test() {}

JSON.stringify(cc, function (key, val) {
  console.log(key, '--key');
  console.log(val, '--val');
  console.log(this[key], '--this[key]');
  console.log(this[key] === val, '--this[key] === val');
  if (typeof this[key] === 'function') {
    return this[key].toString();
  }
  return val;
});

// 深度遍历