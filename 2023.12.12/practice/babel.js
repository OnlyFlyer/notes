// js 的编译器

//! 主要的功能有几个：

// 1. 把代码中 esnext 的语法转换成目标环境支持的语法实现，还可以把目标环境不支持的 api 进行 polyfill
// 2. 代码转换，比如在函数里面加一个特定的日志，埋点等，国际化等
// 3. 代码静态分析，lint 工具，api 文档自动生成，压缩混淆代码

//! babel 的编译流程

// 一般编译器（Compiler） 是指高级语言到低级语言的转换工具，特殊的，高级语言到高级语言的转换工具，叫做 转换编译器，简称转译器（Transpiler）

// 高级语言：有很多用于描述逻辑的语言特性，比如分支、循环、函数等，接近人的思维，比如：c++、JavaScript
// 低级语言：与硬件和执行细节有关，会操作寄存器、内存、具体做内存与寄存器之间的肤质，需要开发者理解熟悉计算机的工作原理

// babel 是一个 JavaScript Transpiler

// babel 中的 AST（Abstract syntax tree）

// 通过不同的对象来保存不同的数据，并按照以来关系组织起来的这种数据结构
// 之所以叫抽象语法树是因为数据结构中省略掉了一些无具体意义的分隔符号，比如; {} 等

//! AST 常见语法

// 字面量、标识符、表达式、语句、class 等等

//! AST 公共属性

// type：AST 节点类型

//! babel 的常见 API

// parse：@babel/parser，将源码转换成 AST

// transform：@babel/traverse，遍历 AST，并调用 visitor 函数修改 AST，
// 修改 AST 自然涉及到 AST 的判断、创建、修改等，这时候就需要 @babel/types
//  了，当需要批量创建 AST 的时候可以使用 @babel/template 来简化 AST 创建逻辑

// generate：@babel/generate，阶段会把 AST 打印为目标代码字符串，同时生成 sourcemap，

// 另外：
// 中途遇到错误想打印代码位置的时候，使用 @babel/code-frame 包
// babel 的整体功能通过 @babel/core 提供，基于上面的包完成 babel 整体的编译流程，并实现插件功能

