## 原理:

当 报错没有做 `try catch` 操作时会触发 `window.onunhandledrejection` 事件
即使做了 `try catch` 操作，也会触发 `window.onrejectionhandled` 事件

`window.onerror` 一场报错会捕获

可以监听这些事件来上报错误

## 需要注意的点:

事件hashchange只会在 hash 发生变化时才能触发，而第一次进入到页面时并不会触发这个事件，因此我们还需要监听load事件。

#### 初始化信息:

1. 用户信息(当获取到用户信息时要注入埋点SDK 里，具体怎么存可以放到 localStorage/window/闭包/indexDB都可以)
2. 路由模式(hash: `hashchange` / history: `window.history.back`，`window.history.go` )
3. spa/mpa



#### 需要捕获的点

1. keypress(键盘输入) document.addEventListener('keypress', function () {}, false)
2. 未捕获的异常