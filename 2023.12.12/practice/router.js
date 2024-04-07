// 前端路由主要实现的功能

// 1. 记录当前页面的状态（保存或者分享当前页面的 URL，再次打开该 URL 时，页面还是保存或者分享的状态）
// 2. 可以使用浏览器的前进、后退、跳转功能


// 要实现以上的功能，开发者需要做的是

// 1. 改变 URL 时不让浏览器向服务器发起请求
// 2. 检测 URL 的变化
// 3. 根据截获 URL 的地址。分析出需要的信息匹配路由规则


//! hash 模式 （#号以及后面的字符） hash 也被称作锚点，本身是
// 用来做页面定位的，它可以使对应id的元素显示在可视区域内

// 由于 hash值变化不会导致浏览器向服务器发出请求，hash 改变
// 会触发 hashchange 事件，浏览器的前进后退也能对其进行控制

const hash = window.location.hash;

window.addEventListener('hashchange', function() {
  // 监听 hash 变化，点进浏览器的前进后退也会触发
});


//! history 模式，是 html5 提出的api

// 原因1:hash是用于做页面定位的，如果拿来做路由，那么锚点功能就不能用了
// 原因2:hash传参是基于URL，传递复杂的数据，会有体积限制，
// history可以在URL里放参数，也可以将数据放在一个特定的对象中

window.history.pushState(state, title, url)
// state：需要保存的数据，这个数据在触发popstate事件时，可以在event.state里获取
// title：标题，基本没用，一般传 null
// url：设定新的历史记录的 url。新的 url 与当前 url 的 origin 必须是一樣的，否则会抛出错误。url可以是绝对路径，也可以是相对路径。
//如 当前url是 https://www.baidu.com/a/,执行history.pushState(null, null, './qq/')，则变成 https://www.baidu.com/a/qq/，
//执行history.pushState(null, null, '/qq/')，则变成 https://www.baidu.com/qq/

window.history.replaceState(state, title, url)
// 与 pushState 基本相同，但她是修改当前历史记录，而 pushState 是创建新的历史记录

window.addEventListener("popstate", function() {
    // 监听浏览器前进后退事件，pushState 与 replaceState 方法不会触发
});
new Event('popstate')
dispatchEvent

window.history.back() // 后退
window.history.forward() // 前进
window.history.go(1) // 前进一步，-2为后退两步，window.history.lengthk可以查看当前历史堆栈中页面的数量

// ---

//  缓存 pushState、replaceState 的值
const bindEventListener = function(type) {
  const historyEvent = history[type];
  return function() {
      const newEvent = historyEvent.apply(this, arguments);
    //  const e = new Event(type); 最好是上面这种
     const e = new Event('popstate');
      e.arguments = arguments;
      window.dispatchEvent(e);
      return newEvent;
  };
};
history.pushState = bindEventListener('pushState');
history.replaceState = bindEventListener('replaceState');
