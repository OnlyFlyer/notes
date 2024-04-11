// forin 与 forof

// for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值

// for in总是得到对象的key或数组、字符串的下标

// forin 是用于遍历一个对象的所有的可枚举字符串的属性，不包括 Symbol，包括继承的可枚举属性;

class Person {
  a = 1;
  b = 2;
  constructor(c) {
    this.c = c;
  };
};
const p = new Person(3);
for (const key in p) {
  console.log(key); // a, b, c
}

// forof 是用于遍历一个可迭代的对象，比如 数组，Map，Set，arguments，NodeList 等

// for of总是得到对象的value或数组、字符串的值

const iterable = [10, 20, 30];

for (const value of iterable) {
  console.log(value); // 10 20 30
}

for (let value of iterable) {
  value += 1;
  console.log(value); // 11 21 31
}
