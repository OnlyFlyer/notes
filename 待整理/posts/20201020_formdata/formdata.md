> `FormData` 接口提供了一种表示表单数据的键值对 key/value 的构造方式，并且可以轻松的将数据通过 `XMLHttpRequest.send()` 方法发送出去，本接口和此方法都相当简单直接。如果送出时的编码类型被设为 "multipart/form-data"，它会使用和表单一样的格式。详见[FormData.append](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/append)

---

## append/set 需要注意:

参数支持三个，前两个参数分别对应 `key`、`value`，但是 `value` 传值是有要求的，只支持 `String`、`Blob`、`File` 三种类型的值，若不是这三种类型，会强制转换为 `String` 类型的参数，当我们日常使用的时候碰到对象的传值都会 `JSON.stringify` 一下，这里有稍微注意一下，`JSON.stringify` 在有些情况不能达到我们想要的结果，例如 一个 `File` 文件或者 `Blob` 文件 `JSON.stringify` 之后会变成 `{}`，详见 [JSON.stringify](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

源数据:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e1d47be810c4cafb60ffd57cae19521~tplv-k3u1fbpfcp-watermark.image)

1. 最初版，未考虑到复杂类型的问题，直接 `append`，这会导致对象直接被转成 `[object Object]` 而参数校验不通过

```JavaScript
  data: {
    ...defaultQuery,
    ...query
  },
  transformRequest: [
    _data => {
      const data = new window.FormData()
      for (const key in _data) {
        let value = _data[key]
        data.append(key, value)
      }
      return data
    }
  ]

```

结果:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1640cd378d6c4d49a56e05805d282b20~tplv-k3u1fbpfcp-watermark.image)

2. 改良版，考虑到复杂类型，但对 `JSON.stringify` 不了解，将 `Blob` 和 `File` 文件也 `JSON.stringify` 了


```JavaScript
  data: {
    ...defaultQuery,
    ...query
  },
  transformRequest: [
    _data => {
      const data = new window.FormData()
      for (const key in _data) {
        let value = _data[key]
        if (_data[key] instanceof Object) {
          value = JSON.stringify(_data[key])
        }
        data.append(key, value)
      }
      return data
    }
  ]

```

结果:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e279d9f6badf4aa7bed9b3980b57e169~tplv-k3u1fbpfcp-watermark.image)

3. 再次改良版

```JavaScript

  const specialFileType = ['Blob', 'File']

  // ...
  data: {
    ...defaultQuery,
    ...query
  },
  transformRequest: [
    _data => {
      const data = new window.FormData()
      for (const key in _data) {
        let value = _data[key]
        if (_data[key] instanceof Object && !specialFileType.includes(_data[key].constructor.name)) {
          value = JSON.stringify(_data[key])
        }
        data.append(key, value)
      }
      return data
    }
  ]

```

结果:

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bf7eb4f1e6e4fffa280e5f2b405e0dd~tplv-k3u1fbpfcp-watermark.image)


总结:

目前看来解决了 `Blob` 和 `File` 的问题，其实最后那种还不够完善，因此最开始说了，`JSON.stringify` 有一些特殊情况，譬如，`function` 会被转换成 `undefined`，布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值 等等，但是一般用是足够了，最后通过 `JSON.stringify`，可以简单聊一下，为什么会有序列化与反序列化这一说，简单来说就是不同语言的语法、特性不同，在 JavaScript 中，我们称 `[1, 2, 3]` 为一个数组，可通过 `new Array(1,2,3)` 来创建，也可通过字面量去创建，但在 `Java` 中可能不这么叫，也不通过这样创建，但是实际上是一个东西，不同的语言是无法直接交互的，除非有中间件去抹平之间的差异，而 [JSON](https://zh.wikipedia.org/wiki/JSON) 就是这个中间件，独立于语言的文本格式使得它可以成为语言间的一种标准，大家不管用什么语言，但是数据传输都使用这种格式，每种语言都有对应的格式化、解析方法。