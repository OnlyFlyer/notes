## mock interview


flex: 1

默认值
flex: 0 1 auto;

flex: auto = 1 1 auto;
flex: none = 0 0 auto;

flex: 1 = 1 1 0;
flex: 1 1 = 1 1 0;

一个值的情况分两种：
1. 不带单位相当于是放大数值
2. 带单位则表明是 第三个参数，最小宽度

两个值：
  1. 第一个是放大数值
  2. 第二个是缩小数值


### Zenlayer

行业	规模
云服务	500 - 1000

1. 比较有挑战的项目或者事情

molecule（语法、词法）、不见面音视频
数据流方案，如何设计数据流方案？会用到什么设计模式？mobx 和 rematch、redux-toolkit 区别，实现的原理

发布订阅
数据劫持

2. 页面性能的优化方法

状态隔离（props，有 state 吗？）、性能优化 API

3. React diff 比对的顺序 - 深度优先遍历

4. HTTP 缓存

HTTP1.1

   - 高延迟（队头堵塞 Head of Line Blocking）：当顺序发送的请求序列中的一个请求被阻塞时，在后面排队的也会被阻塞，会导致客户端等待时间延长
     - 将页面的资源分散到不同的域名下面，提升连接上限，Chrome 有一个机制，对于同一个域名，默认允许同时建立6个 TCP 持久连接，虽然能够共用一个 TCP 管道，但是同一个管道同一时刻只能处理一个请求
     - 合并小文件，减少资源数
   - 无状态，带来巨大的 HTTP 头部
   - 明文传输，不安全
   - 单向连接，无法做服务器推送

HTTP2

  - 二进制传输（将请求和响应数据分割成更小的帧，采用二进制编码），同域名下所有通信都在一个连接上完成，可以承载任意数量的双向数据流，每个数据流以消息的方式发送，消息由一个或多个帧组成，多个帧之间可乱序发送，根据帧首部的流标识来拼装
  - Header 压缩 HPack
  - 多路复用，解决浏览器限制同一域名下的请求数量，因为新开一个 TCP 连接都需要慢慢提升传输速度
  - 服务器推送

强缓存、协商缓存 各有的字段

1. 如果要部署一个环境，部署 ngix，用哪种 HTTP 缓存好一点

对于不太变化的静态资源 比如 js、css、图片等等，可以进行强缓存优化方式
对于常变化的 index.html 入口，可以使用 协商缓存 来进行优化，到需要更新的时候调整 请求的查询字符串即可

1. Vite 有了解过吗？前几年比较火的

简单了解一下

7. esmodule 规范，与 commonjs 的区别

esmodule 有什么好处？

便于静态分析，为什么 commonjs 不能做静态分析

esm 现在也可以支持不放在顶部了， daynamic import 动态加载，这个怎么说？

除了模块这些，还有没有其他的好处、优点

esm 可以通过 import url 引入， commonjs 不行，但会带来一个问题，请问是什么问题？

   1. 依赖于网络连接，如果网络不稳定或者无法访问远程资源可能会导致加载失败
   2. 缺乏可靠性，如果网络攻击等，会导致应用程序加载变慢或者无法正常工作
   3. 缺乏安全性，如果被恶意劫持，返回了恶意的代码，可能会导致安全风险
   4. 缓存问题不好控制

csp（Content Security Policy） 了解过吗？

8. 简单请求和非简单请求的区别，具体一点，非简单请求时，options 请求，服务端需要返回什么才是正常的，什么不是正常的



9.  你觉得你最熟悉的是哪一块？

webpack 的性能问题解决
10. 离线首屏加载优化怎么做的？
11. WebRTC 好用吗？IM？
12. React hooks 是如何实现的？hooks 原理是什么？useMemo 如何实现的？useCallback 如何实现？


useMemo -> 作用是 为了减轻很重的计算量   函数式编程，闭包实现的，缓存一个变量，每次执行看看这个结果和变量是否一致，如果不变直接返回。

13. React 最深了解到什么程度？

14. CSS 的回流（重排）和重绘有了解过吗？

### 大华

1. 离线首屏如何加载？

没有网也能浏览网页

PWA（Progressive Web Apps），核心是用户体验

  - Web APP Manifest，主要的体现就是一个 manifest.json 文件

Service Worker

  - 介于 浏览器和 服务端之间的一个代理服务器
  - 可拦截网络请求、可操作本地缓存(CacheStorage、IndexDB 等)，可接受服务器推送的离线消息
  - HTTPS 下才可执行

骨架屏
  尽量用内连而不是通过 link 标签去做， 其他外链的 link 标签需要设置一下，  ref='stylesheet' -> ref='preload'，因为涉及到 浏览器的渲染流程

响应式布局

  设备像素（手机像素）
  CSS 像素
  称为设备像素比 dpr（Device Pixel Ratio）

  em：相对单位，相对于元素自身的 font-size
  rem（Root em） html，html 默认的字体大小是 16px， postcss-px2rem

Web Push

1. 单元测试有用过吗？



--


### 字节跳动

行业	规模
直播	1000+

1. 首屏加载优化，做了哪些优化？如何检测优化结果？

检测优化结果：

lighthouse 结论
FCP（First Contentful Paint）：浏览器首次绘制页面的时间点
LCP（Largest Contentful Paint）：最大内容绘制，显示最大元素所需时间
CLS（累计布局位移，用于衡量页面上元素在渲染过程中发生不期望的移动的情况）：
FID（首次输入延迟，衡量用户首次和浏览器发生交互到浏览器实际响应用户的延迟时间）：

   - 针对后台接口请求阶段的性能瓶颈：
     - 与后台沟通，减少或者合并请求的数量
     - 考虑 BFF 方案，减少请求的数量
     - 数据预加载
   - 针对 js 资源的瓶颈
     - 对非首屏 js 进行懒加载
     - 由于 js 请求采用了 HTTP/2，可以使用 splitChunk 拆分 js，利用 HTTP/2 多路复用的优势


chunkjs、HTTP 请求

1. 页面卡顿问题解决

2. 汉化方案，写了一个插件

3. 统一产品图标规范

4. 不见面监管大厅

5. 音视频和消息通讯，会有延迟，怎么做到同步?

SEI 补充增强信息（Supplemental Enhancement Information），在
音视频流每一帧可以带一些额外的信息，比如时间戳，心跳检测 等等，可以通
过这些信息进行计算、比对

7. 谈一下 IM？

轮训查找，有缺点，就是 QPS 会很高，有压力

可以切换为 WebSocket，但是需要做兼容处理，一些老的浏览器或者老的版本还是要用 轮询

8. **编程题** 实现一个 观察者模式（发布订阅）

观察者模式和发布订阅不同

on 和 once 可以结合

1. PC 端 单页应用，微前端有了解过吗？沙箱隔离是 js，有知道 css 隔离吗？

主应用和若干个子应用：

主应用：
  1. 用于注册子应用，和子应用的一些配置，比如：入口文件地址，子应用名称，路由标识 等信息
  2. 主应用启动后会监听路由变化，当匹配到某一个子应用的路由时，会加载该子应用的js、css等资源，并做渲染
子应用：
  1. 子应用就是暴露出几个关键的 hook 钩子用于主应用进行调用，还有一些全局的变量，包括一些 render 容错，比如没有获取到 微前端架构的字段就用之前的render 老方案容灾。

问题：
  1. 在 vite 项目接入的时候总是报错，发现 vite 应用一直无法获取生命周期， 才知道那时 qiankun 暂时不支持 vite 应用

大致原因如下：
* vite 构建的 js 内容必须在 type=module 的 script 脚本里；
* 当时qiankun 的源码依赖之一 import-html-entry 则不支持 type=module 这个属性 （目前已支持）;
* qiankun 是通过 eval 来执行这些 js 的内容，而 vite 里面 import/export 没有被转码， 所以直接接入会报错：不允许在非type=module 的 script 里面使用 import;
在去年年尾的时候，在qiankun 的 issues 中找到了2种方法；

https://github.com/kuitos/import-html-entry/pull/35

vite 配置成功参考： https://juejin.cn/post/7263457589810708537#heading-36

应用通信， postMessage， 子应用之间、父子应用之间通信

如果考虑做微前端架构，就不会考虑 iframe

如果通信通过上面的发布订阅去做就可以。

js 隔离：

#### 快照沙箱

  优缺点: snapshotSandbox会污染全局window，但是可以支持不兼容Proxy的浏览器。
  基本思路: 在利用快照,赋值和还原window属性,达到进出沙箱的效果

  激活沙箱,记录 window 的快照 windowSnapshot 将上一个沙箱修改过的属性赋值给window(还原修改)
  使用该沙箱,操作全局window
  退出沙箱 找出修改了的属性存入modifyPropsMap 还原window为快照状态

```js

// 遍历window属性并执行回调
const iter = (window, callback) => {
  for (const prop in window) {
    if(window.hasOwnProperty(prop)) {
      callback(prop);
    }
  }
}

class SnapshotSandbox {
  constructor() {
    this.proxy = window;
    this.modifyPropsMap = {};
	  this.windowSnapshot = {};
  }
  // ------激活沙箱-------
  active() {
		 // 记录active时window的快照
    iter(window, (prop) => {
      this.windowSnapshot[prop] = window[prop];
    });
		// 将上一次沙箱修改过的属性赋值给window(还原修改,重新进入沙箱)
    Object.keys(this.modifyPropsMap).forEach(p => {
      window[p] = this.modifyPropsMap[p];
    })
  }

// ----- 使用该沙箱,在全局window上操作,退出时还原window为快照状态

  // --------退出沙箱-------
  inactive(){
    iter(window, (prop) => {
	// 修改后的window和快照时的window属性比对,找出修改了的属性,放入modifyPropsMap
      if(this.windowSnapshot[prop] !== window[prop]) {
        this.modifyPropsMap[prop] = window[prop];
        window[prop] = this.windowSnapshot[prop]; // 还原window为快照时的状态
      }
    })
  }
}

const proxy1 = new SnapshotSandbox();
const proxy2 = new SnapshotSandbox();
((window) => {
   // 激活沙箱 (进入到沙箱)
   proxy1.active();
   window.name= 'proxy1';
   console.log(window.name); // 张三
   // 退出沙箱 (切换到原本的window)
   proxy1.inactive();
   console.log(window.name); // undefined
   // 重新激活沙箱(重新进入到沙箱)
   proxy1.active();
   console.log(window.name); // 张三
})(proxy1.proxy);
console.log(window.name, '--全局window');
((window) => {
   // 激活沙箱 (进入到沙箱)
   proxy2.active();
   window.name= 'proxy2';
   console.log(window.name); // 张三
   // 退出沙箱 (切换到原本的window)
   proxy2.inactive();
   console.log(window.name); // undefined
   // 重新激活沙箱(重新进入到沙箱)
   proxy2.active();
   console.log(window.name); // 张三
})(proxy2.proxy);


```

#### 代理沙箱

1. 激活沙箱，每次对 window 取值的时候，先从自己沙箱环境的 fakeWindow 里面找，
2. 如果不存在，就从rawWindow(外部的window) 里去找；
3. 当对沙箱内部的window对象赋值的时候，会直接操作fakeWindow，而不会影响到rawWindow。
4. 优点： 不会污染全局window，支持多个子应用同时加载。

```js
class ProxySandbox {
  sandboxRunning = false;
  proxy = null;
  constructor() {
    const rawWindow = window;
    const fakeWindow = {};
    const proxy = new Proxy(fakeWindow, {
      set: (target, propName, propValue) => {
        if (!this.sandboxRunning) return;
        target[propName] = propValue;
        return true;
      },
      get: (target, propName) => {
         // 如果fakeWindow里面有，就从fakeWindow里面取，否则，就从外部的window里面取
        let value = propName in target ? target[propName] : rawWindow[propName];
        return value;
      },
    });
    this.proxy = proxy;
  };
  active() {
    this.sandboxRunning = true;
  }
  inactive() {
    this.sandboxRunning = false;
  };
};
window.sex = '男';
let proxy1 = new ProxySandbox();
let proxy2 = new ProxySandbox();
(function(window) {
  proxy1.active();
  console.log('修改 proxy1 之前的sex：', window.sex); // 男
  window.sex = '女';
  console.log('修改 proxy1 之后的sex：', window.sex); // 男
})(proxy1.proxy)
console.log('外部window.sex', window.sex);  // 男(不影响外部window)
(function(window) {
  proxy2.active();
  console.log('修改前proxy2的sex', window.sex);// 男
  window.sex = '人妖';
  console.log('修改后proxy2的sex', window.sex);//人妖
})(proxy2.proxy)


```

样式隔离：

   1. antd 的那种，在构建的时候通过构建工具统一 prefix 这种方式
   2. css module，为每一个 className 加一个hash 值保证唯一
   3. css-in-js
   4. Shadow DOM
   5. vue scope
   6. web component

如何实现对 localStorage、cookie 隔离：

  1. 一般这种场景不存在，因为一个应用通常这些信息都是共享的，比如登陆这种场景，如果需要做的话，那么 qiankun 提供了
  2. 几个钩子函数，这一部分可以在钩子函数里面去进行缓存，然后挂载的时候再取应该就好了

1.  问题

    - 业务情况
    - 抖音音视频大致的链路
      - 信息连接通过 轮询，后面换成了 Websocket（浏览器兼容）
    - Buffer 的问题，建立连接，大头在直播播放器端，如果推流端游卡顿，那么拉流会有卡顿，体验不好，所以接受端会 delay 2s 或者是 n s，有两秒的缓冲

- 回答有时候会失焦，抓不到重点
- 做过 Web RTC 相关项目，但是并未深入了解底层原理（基于三方库做封装）


如何禁止 js 访问 cookie：

使用 set-cookie 来设置 cookie，httpOnly 选项，这个选项禁止任何 js 访问 cookie
