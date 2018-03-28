# Vue 总结

1. 数据驱动

Vue.js 的核心是一个响应的数据绑定系统, 它让 `数据` 和 `DOM` 保持同步很简单. 在使用 `Vue` 开发项目的时候, 我们在普通 `HTML` 模版中使用特殊的语法将 `DOM` 绑定 到底层数据, 一旦创建绑定后, `DOM` 将与数据保持同步. 这样的话我们应用中的逻辑几乎都是直接修改数据而不必与 `DOM` 更新搅在一起, 让代码更容易理解和维护.

2. 双向绑定


个人对 `Vue` 的理解是让 `DOM` 与 `数据` 形成一个类似于函数映射的关系, 我们知道, 在数学中, 函数的定义是: 输入值集合中的 `每一项` 元素皆能对应 `唯一一项` 输出值集合的元素. 先暂且不用管 `DOM` 和 `数据` 谁是自变量, 谁是函数值, 它们之间任意一个发生改变, 另一个也会跟着一起改变, 这就是 `Vue` 的响应数据绑定的原理. 其次, `Vue.js` 由数据驱动 `web` 界面的一个库, 也就是说, 数据更替从而使得 `DOM` 的变化, 从而达到了 `web` 界面刷新的效果.

3. 组件系统

![](./img/vue-components.png)

对于组件可能很多人都不陌生, 现在的前端框架基本都有组件这一说, `Vue` 组件是提供了一种抽象, 让我们可以用独立的可复用的小组件来构建复杂的大型应用. 组件的好处很多, 第一, 高可用, 减少重复性操作. 第二, 组件一般都定义为自定义组件, 组件间的数据流和组件内部的数据流严格区分开, 方便管理和维护.

4. Vue 实例

每个 Vue.js 应用的起步都是通过构造函数 `Vue` 创建一个 Vue的根实例.

```JavaScript

  let vm = new Vue({
    // ...
  })

```

一个 Vue 实例就是 MVVM 模式中描述的 `ViewModel`. 在实例化 Vue 时, 需要传入一个选项对象, 它包含数据、模版、挂载元素、方法、生命周期函数等选项.

Vue 实例暴露出一些实例属性和方法, 这些属性和方法都有前缀 $, 以便与代理的数据属性区分.

```JavaScript

  let data = {
    a: 1
  }
  let vm = new Vue({
    el: '#div1',
    data
  })

  vm.$data === data // -> true
  vm.$el === document.getElementById('div1') // -> true

```
> `Vue` 生命周期

![](./img/vue-lifecycle.png)

`Vue` 生命周期函数是 `Vue 实例` 在创建时一系列的初始化步骤, 建立数据观察、编译模版、创建必要的数据绑定等时调用的生命周期钩子.


> `Vue` 计算属性

在模板中绑定表达式很方便, 但是只用于简单的操作, 模板只是为了描述视图的结构, 太多的逻辑会让模板过重且难以维护, 如果需要多个表达式的逻辑, 就可以使用 `计算属性` .


```
  <div id='example'>
    a={{ a }}, b = {{ b }}
  </div>

  let vm = new Vue({
    el: '#example',
    data: {
      a: 1
    },
    computed: {
      b: function () {
        return this.a + 1
      }
    }
  })

  // result
  a = 1, b = 2


```

> 计算属性 vm.$watch

Vue.js 提供了一个方法 `$watch` , 用于观察 Vue 实例上的数据变动.

```
  <div id='example'>{{ fullName }}</div>

  let vm = new Vue({
    el: '#example',
    data: {
      firstName: 'Frank',
      lastName: 'Wu',
      fullName: 'Frank Wu'
    }
  })

  vm.$watch('firstName', function (val) {
    this.fullName = val + ' ' + this.lastName
  })
  
  vm.$watch('lastName', function (val) {
    this.fullName = this.firstName + ' ' + val
  })
```

如果用 `computed` 计算属性的话是这样的:

```JavaScript

  let vm = new Vue({
    el: '#example',
    data: {
      firstName: 'Frank',
      lastName: 'Wu'
    },
    computed: {
      fullName: function () {
        return this.firstName + ' ' + this.lastName
      }
    }
  })

```


> `props`

        1. 使用 `props` 传递数据

组件实例的作用域是孤立的. 不能在自组件的模板里面直接引用副组件的数据, 需要 使用 `props` 把数据传递给子组件

`props` 是组件数据的一个字段, 期望从父组件传下来, 子组件需要显式地用 `props` 选项声明 `props`:

```JavaScript

  Vue.component('child', {
    props: ['msg'],
    template: '<span>{{ msg }}</span>'
  })

```

然后可以就可以传入数据了: 

`<child msg='morning!'></child>`

props 默认是单向绑定的, 当父组件的属性变化时, 传递给子组件, 但是不会反过来, 这是为了防止子组件无意修改了父组件的状态--这会让应用的数据流难以理解. 不过, 也可以使用 `.sync` 或 `.once` 绑定修饰符显式地强制双向或单次绑定：

```HTML

  <!-- 默认的单向绑定 -->
  <child :msg='parentMsg'></child>

  <!-- 双向绑定 -->
  <child :msg.sync='parentMsg'></child>

  <!-- 单次绑定 -->
  <child :msg.once='parentMsg'></child>

```

**注:** 若 props 是一个对象或数组, 是按引用传递. 在子组件内修改会影响父组件的状态, 不管使用哪种绑定类型.

        2. props 验证

  组件可以为 props 指定验证要求, 当组件给其他人使用时这很有用, 因为这些验证要求构成了组件的 API, 以确保其他人正确地使用组件, 此时 props 的值是一个对象, 包含验证要求:

  ```JavaScript
  
    Vue.component('example', {
      props: {
        // 基础类型检测, `null` 表示任何类型都可以
        propA: Number,
        propM: [String, Number],
        // 必须是 String 类型
        propB: {
          type: String,
          required: true
        },
        // Number 类型, 默认值为 100
        propC: {
          type: Number,
          default: 100
        }
      }
    })
  
  ```

  ## 组件

创建组件的构造器: `Vue.extend()`

注册组件: `Vue.component()`


```JavaScript

  // 创建组件
  let MyComponent = Vue.extend({
    // ...
    props: ['aa', 'bb'],
    template: '<div>{{ aa }}{{ bb }}</div>'
  })

  // 注册组件
  Vue.component('my-component', constructor)

  // 使用组件
  <my-component></my-component>
```

`Vue` 的模版是 DOM 模板, 使用浏览器原生的解析器而不是自己实现一个


```
  // 动态 props
  <div>
    <input type='text' v-model='parentMsg'/>
    <child :my-message='parentMsg'></child>
  </div>


```

```JavaScript

  // 子组件
  <template id='child-template'>
    <input type='text' v-model='msg' />
    <button v-on.click='addToList'>click me</button>
  </template>

  // 父组件
  <div id='example'>
    <p>Messages: {{ message | json }}</p>
    <child></child>
  </div>

  // 注册子组件
  Vue.component('child', {
    template: '#child-template',
    data () {
      return {
        msg: 'Hello'
      }
    },
    methods: {
      addToList () {
        if (this.msg.trim()) {
          this.$dispatch('child-msg', this.msg)
          this.msg = ''
        }
      }
    }
  })

  let parent = new Vue({
    el: '#example',
    data: {
      message: []
    },
    events: {
      'child-msg': function (msg) {
        this.message.push(msg)
      }
    }
  })





```









directive(指令), watch(观察Vue实例上的数据变动), 

重绘(redraw): 是一个元素的外观变化所引发的浏览器行为；例如改变visibility、outline、背景色等属性.

重排(reflow): 是引起 `DOM树` 重新计算的行为.

重绘不一定重排, 但重排一定重绘

引发重排:

1. 添加、删除可见的 DOM
2. 元素位置改变
3. 元素尺寸改变(内外边距、边框、厚度、宽高等)
4. 页面渲染初始化
5. 浏览器窗口尺寸改变

应该尽可能的减少重排:

1. 多次 dom 合并修改成一次操作
2. 多次重排的元素, 先脱离文档流, 再修改
3. 缓存