
# promise 理解

本文是看完 `liubin` 的博客中写的 `JavaScript Promise 迷你书` 总结的, 有需要的可以去看一看, 地址: [JavaScript Promise迷你书](http://liubin.org/promises-book/#introduction)

`Promise` 是抽象异步处理对象以及对其进行各种操作的组件

```JavaScript

  getAsync('file.txt', function (error, result) {
    if (error) {
      throw error
    }
    // 取得成功时的处理
  })

```

`Node.js` 规定在 `JavaScript` 的回调函数的第一个参数为 `Error` 对象, 而 `Promise` 把类似的一步处理对象和处理规则进行规范化, 并按照采用统一的接口来编写, 而采取规定方法之外的写法都会出错.

```JavaScript

  let promise = getAsyncPromise('file.txt')
  promise
    .then(function (result) {
      // 获取文件成功时的处理
    })
    .catch(function (error) {
      // 获取文件失败时的处理
    })

```

上面的代码可以看出, `promise` 的功能是可以将复杂的异步处理轻松地进行模式化


`Promise` 类似于 `XMLHttpRequest`, 从构造函数 `Promise` 来创建一个新建新 `promise` 对象作为接口

要想创建一个 `promise` 对象, 可以使用 `new` 来调用 `Promise` 的构造器来进行实例化

```JavaScript
  let promise = new Promise(function (resolve, reject) {
    // 异步处理
    // 处理结束后, 调用 resolve 或 reject
  })

```

对通过 `new` 生成的 `promise` 对象为了设置其值在 `resolve(成功)` / `reject(失败)` 时调用的回调函数, 可以使用 `promise.then` 实例方法.


## `promise` 的三种状态

`promise` 对象有三个状态: `resolve` , 此时会调用 `onFulfilled` , `reject` , 此时会调用 `Rejected` , `Pending` , 也就是 `promise` 对象刚被创建后的初始化状态


```JavaScript

  promise.then(onFulfilled, onRejected)

```

**resolve(成功)时:** `onFulfilled` 会被调用

**reject(失败)时:** `onRejected` 会被调用

`onFulfilled` 、 `onRejected` 两个都为可选参数

`promise.then` 成功和失败时都可以使用, `另外, 在只想对异常进行处理时可以采用 promise.then(undefined, onRejected)` 这种方式, 只指定 `reject` 时的回调函数即可, 不过这时 `promise.catch(onRejected)` 应该更好一点

```JavaScript

  promise.then(undefined, onRejected)

  promise.catch(onRejected)

```

像 `Promise` 这样的全局对象还拥有一些静态方法

包括 `Promise.all()` 、 `Promise.resolve` 等在内, 主要都是一些对 `Promise` 进行操作的辅助方法

```JavaScript

  function asyncFunction () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve('Hello !')
      }, 1000)
    })
  }

  asyncFunction()
    .then(function (value) {
      console.log(value)
    })
    .catch(function (error) {
      console.log(error)
    })

    // 答案是隔1秒后输出 Hello !
    // 我个人的理解是: .then()函数接受的是成功之后的回调函数, .catch()函数接受的是失败后的回调函数, 当 asyncFunction() 执行的时候, 返回的是一个 Promise 对象, 里面有一个定时器, 因此 1秒后执行 resolve 出来, 反馈给 .then() 函数, 因此输出了 Hello !
```


  下面是看了 `liubin` 博客后模仿写了用 `Promise` 来通过异步处理方式来获取 `XMLHttpRequest(XMR)` 的数据

```JavaScript

  function getURL (URL) {
    return new Promise(function (resolve, reject) {
      let req = new XMLHttpRequest()
      // 异步为 true, 同步为 false
      req.open('GET', URL, true)
      req.onload = function () {
        if (req.readyState === 4 && req.status === 200) {
          resolve(req.responseText)
        } else {
          reject(new Error(req.statusText))
        }
      }
      req.onerror = function () {
        reject(new Error(req.statusText))
      }
      res.send()
    })
  }

  getURL('http://httpbin.org/get')
    .then(function (value) {
      console.log(value)
    })
    .catch(function (error) {
      console.log(error)
    })

```

简单的说: `getURL()` 函数返回一个 `Promise`, Ajax 请求写在 `Promise` 内, 若请求成功, 则 将结果塞到 `resovle` 方法里面, 所以在 `.then()` 方法能够获取到成功的数据, 失败的时候 将结果 塞到 `reject` 函数里, 在 `.catch()` 函数中能够获取的 `error` 信息


## `Promise.resolve`

```JavaScript

  new Promise(function (resovle) {
    resolve(42)
  })

  Promise.resolve(42)

  // 后者可认为是前者代码的语法糖, Promise.resolve(42) 会让这个 Promise 对象进入确定状态(即 resolved 状态), 并将其状态的值 42 传给后面 .then 函数
  // 因为 Promise.resolve(value) 的返回值也是一个 promise 对象, 所以我们可以对其返回值进行 .then 调用, 如:

  Promise.resolve(42)
    .then(function (value) {
      console.log(value)
    })

```

`Promise.resolve` 方法另一个作用就是将 `thenable` 对象转换为 `promise` 对象, `thenable` 是一个很像 `promise` 的东西, 但又不完全是, 就像 我们常用的 `数组` 与 `类数组` 的关系,
`thenable` 指的是具有 `.then` 方法的对象, 但是其 `.then` 并没有遵循 `Promise/A+` 或 `ES6 Promise` 标准, 因此可能会出现缺失部分信息的问题, `Promise.resolve` 只是用了共通的方法 `then`, 提供了在不同的类库之间进行 `promise` 对象互相转换的功能.

总结一下 `Promise.resolve` 方法, 就是将传递给它的参数填充到 `promise` 对象后并返回这个 `promise` 对象

## `Promise.reject`

`Promise.reject(error)` 是和 `Promise.resolve(value)` 类似的静态方法, 是 `new Promise()` 方法的快捷方式.

`Promise.reject(new Error('error'))` 是下面代码的语法糖形式

```JavaScript

  new Promise(function (resolve, reject) {
    reject(new Error('error'))
  })

```

上面代码的功能是调用该 `promise` 对象通过 `then` 指定的 `onRejected` 函数, 并将错误(Error) 对象传递给 `onRejected` 函数


```JavaScript

  Promise.reject(new Error('BOOM!')).catch(function (error) {
    console.error(error)
  })

```

```JavaScript

  let promise = new Promise(function (resolve) {
    console.log('inner promise')
    resolve(42)
  })

  promise
    .then(function (value) {
      console.log(value)
    })

  console.log('outer promise')

  // inner promise
  // outer promise
  // 42

```


```JavaScript

let promise = function () {
  return new Promise(function(resolve, reject){
    // let data = fetch('http://httpbin.org/get').then()
    // let data = new XMLHttpRequest()
    // data.open('GET', 'http://httpbin.org/get', true)
    // dat.send()
    let data = '小王八'
    if (data) {
    	resolve(data)
    } else {
    	reject(data)
    }
  })
}

promise()
  .then(function(res){
    console.log(res, 1111)
    return res + '1'
  })
  .then(function(res){
    console.log(res, 2222)
    return res + '2'
  })
  .then(function(res){
    console.log(res, 3333)
    return res + '3'
  })
  .then(function(res){
    console.log(res, 4444)
    return res + '4'
  })
  .then(function(res){
    console.log(res, 5555)
    return res + '5'
  })
  .catch(function(err){
    console.log(err, 6666)
  })

  // 小王八 1111
  // 小王八1 2222
  // 小王八12 33333
  // 小王八123 4444
  // 小王八1234 5555

```

