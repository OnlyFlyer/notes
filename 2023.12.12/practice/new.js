
// const p = new Constructor('a', 'b'); -> objectFactory(Constructor, 'a', 'b');

function objectFactory() {
  const obj = {};
  const Constructor = [...arguments].shift();
  const args = [...arguments].slice(1);
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, args);
  // 此处加判断是为了区分构造函数有返回值的情况
  return typeof result === 'object' ? result : obj;
};
