// forin 与 forof

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

const iterable = [10, 20, 30];

for (const value of iterable) {
  console.log(value); // 10 20 30
}

for (let value of iterable) {
  value += 1;
  console.log(value); // 11 21 31
}
