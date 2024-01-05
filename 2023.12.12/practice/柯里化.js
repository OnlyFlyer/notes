// fn(a,b,c,d,e) -> fn(a)(b)(c)(d)(e)
// fn(1,2,3,4) 转换 fn(1)(2)(3)(4)
function compose(fn) {
  return function() {
    const args = [...arguments];
    fn.call(this, fn(args[0]), ...args.slice(1));
  };
};
