1. 当 `Promise` 被拒绝时，会触发全局的 `rejectionhandled` 或 `unhandlerejection` 事件之一，如果已经用 `catch` 拦截了该 `reject`，就会触发 `rejectionhandled`，如果没有拦截就会触发 `unhandlerejection` 事件。


