function add(...args) {
  function arrTotalNum(arr) {
    return arr.reduce((prev, curr) => prev + curr, 0);
  }
  const sum = arrTotalNum(args);
  let fn = function (...args1) {
    const sum2 = arrTotalNum(args1);
    return add(sum + sum2);
  }
  // ***
  fn.toString = function () {
    return sum;
  }
  return fn;
}