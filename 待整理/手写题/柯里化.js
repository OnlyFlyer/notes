// fn(a,b,c,d,e) -> fn(a)(b)(c)(d)(e)
// fn(1,2,3,4) 转换 fn(1)(2)(3)(4)
function compose(fn) {
  return function () {
    const args = Array.from(arguments);
    const that = this;
    fn.call(that, fn(args[0]), ...args.slice(1));
  }
}


function add() {
  return Array.from(arguments).reduce((prev, curr) => prev + curr, 0);
}
const fn = compose(add)(1,2,3,4,5);
