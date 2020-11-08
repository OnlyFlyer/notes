如何实现一个 `react-router`、`vue-router`

1. hash 路由

监听 `hashchange` 事件，但是该事件只会在 `hash` 变化的时候触发，所以，第一次进入是不会触发该事件的，
那么我们还需要额外的监听一次 `onload` 事件，当资源加载完成后调用几次即可，`hashchange` 调用什么函数，`onload` 就调用什么函数。

2. history 路由