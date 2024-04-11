// fn(a,b,c,d,e) -> fn(a)(b)(c)(d)(e)
// fn(1,2,3,4) 转换 fn(1)(2)(3)(4)
function compose(fn) {
  return function() {
    const args = [...arguments];
    fn.call(this, fn(args[0]), ...args.slice(1));
  };
};

function add(x) {
  // 保存每次调用时的参数和结果
  const args = [...arguments];

  // 创建一个内部函数用于接收下一个参数
  function nextArg(y) {
    const _ = [...arguments];
    // 将参数添加到参数数组中
    args.push(..._);
    // 返回自身以支持链式调用
    return nextArg;
  }

  // 重写函数调用时的toString方法，以实现结果输出
  nextArg.toString = function() {
    // 将参数数组中的所有参数相加
    const result = args.reduce((total, num) => total + num, 0);
    return result;
  };

  return nextArg;
}

console.log(add(1)(2, 3)(4, 5, 6)); // 输出：21
