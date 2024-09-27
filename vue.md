## vue 原理剖析

响应式实现的基本结构

```js
// 临时存储响应式函数
const effectStack = []

// 传入 fn, 返回的函数将是响应式的，内部代理的数据发生变化，它会再次执行
function effect(fn, options) {}

// 存放响应式函数和目标、键之间的映射关系
const targetMap = new WeakMap()

// 依赖收集，建立响应式函数与其访问的目标(target)和键(key)之间的映射关系
function track(target, key) {}

// 根据 track() 建立的映射关系，找到对应的响应式函数并执行它
function trigger(target, key) {}
```

### 1. 数据响应式 reactive()

> vue3 中使用 Proxy API 并不能监听到对象内部深层次的属性变化，因此它的处理方
> 式是在 getter 中去递归响应式，这样的好处是真正访问到的内部属性才会变成响应式
> ，简单的可以说是按需实现响应式，减少性能消耗

```js
const isObject = obj => typeof obj === 'object' && obj !== null
const baseHandler = {
  get(target, key, receiver) {
    let res = Reflect.get(target, key, receiver)
    res = isObject(res) ? reactive(res) : res
    return res
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    return res
  },
  deleteProperty(target, key) {
    const res = Reflect.deleteProperty(target, key)
    return res
  }
}
function reactive(obj) {
  if (!isObject(obj)) return obj
  const observed = new Proxy(obj, baseHandler)
  return observed
}

const state = reactive({ a: '前端' })
```

### 添加副作用 effect()

### 依赖收集 track()

### 触发响应 trigger()

```js
// 传入的对象应该是一个非null的object
const isObject = obj => typeof obj === 'object' && obj !== null

const baseHandler = {
  get(target, key, receiver) {
    let res = Reflect.get(target, key, receiver)
    res = isObject(res) ? reactive(res) : res
    // 触发 get 的时候进行依赖收集
    track(target, key)
    return res
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    // 触发 set 的时候进行触发依赖
    trigger(target, key)
    return res
  },
  deleteProperty() {
    const res = Reflect.deleteProperty(target, key)
    return res
  }
}
function reactive(obj) {
  if (!isObject(obj)) return obj
  const observed = new Proxy(obj, baseHandler)
  return observed
}

// 临时存储响应式函数
const effectStack = []

// 存放响应式函数和目标、键之间的映射关系
const targetMap = new WeakMap()

function track(target, key) {
  // 获取响应式函数
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    // 获取 target 映射关系 map，不存在则创建
    let depMap = targetMap.get(target)
    if (!depMap) {
      depMap = new Map()
      targetMap.set(target, depMap)
    }
    // 获取 key 对应的依赖集合，不存在则创建
    let deps = depMap.get(key)
    if (!deps) {
      deps = new Set()
      depMap.set(key, deps)
    }
    // 将响应函数添加到依赖集合
    deps.add(effect)
  }
}
function trigger(target, key) {
  // 获取 target 对应依赖 map
  const depMap = targetMap.get(target)
  if (!depMap) return

  // 获取 key 对应集合
  const deps = depMap.get(key)

  if (deps) {
    // 将普通 effect 和 computed 区分开
    const effects = new Set()
    const computedRunners = new Set()

    // 执行所有响应函数
    deps.forEach(dep => {
      if (dep.computed) {
        computedRunners.add(dep)
      } else {
        effects.add(dep)
      }
    })
    computedRunners.forEach(computed => computed())
    effects.forEach(effect => effect())
  }
}

function computed(fn) {
  // 创建一个特殊的 effect
  // 这个 effect 创建时不会立刻执行，且会在其他 effect 后面执行
  const runner = effect(fn, {
    computed: true,
    lazy: true
  })

  // 返回一个对象包含响应函数和最新值的 getter
  // 这样 computed 首次获取值时才收集依赖
  return {
    effect: runner,
    get value() {
      return runner()
    }
  }
}

function effect(fn, options) {
  // 创建 reactiveEffect
  const effectRun = createReactiveEffect(fn, options)
  // 执行一次触发依赖收集
  effectRun()
  return effectRun
}

function createReactiveEffect(fn, options) {
  // 封装一个高阶函数，除了执行 fn，还要将自己放入 effectStack 为依赖收集做准备
  const effect = function reactiveEffect(...args) {
    if (!effectStack.includes(effect)) {
      try {
        // 1. effect 入栈
        effectStack.push(effect)
        // 2. 执行 fn
        return fn(...args)
      } finally {
        // 3. effect 出栈
        effectStack.pop()
      }
    }
  }
  return effect
}
```
