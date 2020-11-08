## interface 和 type 的区别

共同点:

1. 都可扩展（extends/继承 和 &），可以互相继承
2. 都可描述函数或者对象

不同点:

1. 定义方式不同，type =， interface {}
2. type 可声明基本类型别名，但 interface 不行
3. type 可使用一些判断逻辑来赋值，比如 typof div
4. interface 可以合并，但是 type 不行
