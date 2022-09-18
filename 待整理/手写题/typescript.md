---
marp: true
---
<!-- ## interface 和 type 的区别

共同点:

1. 都可扩展（extends/继承 和 &），可以互相继承
2. 都可描述函数或者对象

不同点:

1. 定义方式不同，type =， interface {}
2. type 可声明基本类型别名，但 interface 不行
3. type 可使用一些判断逻辑来赋值，比如 typof div
4. interface 可以合并，但是 type 不行 -->

# Using TypeScript in React<!-- fit -->

---

## Why

1. 省去了大量翻文档的时间
2. 减少了可编译期发现的低级故障
3. 提高了代码可阅读性和后期维护性

---

## Class Component

```ts
interface Props {
  name: string
  max?: number
  onClick?: (name: string) => void
}

interface State {
  selectedName?: Props['name']
}

const DEFAULT_PROPS: Pick<Props, 'max'> = {
  max: 1,
}

class User extends React.Component<Props, State> {
  static defaultProps = DEFAULT_PROPS

  render() {
    return <div />
  }
}
```

---

## Function Component

```ts
interface Props {
  name: string
  max?: number
  onClick?: (name: string) => void
}

const User: React.FC<Props> = function User(props) {
  const [selectedName, setSelectedName] = React.useState<Props['name']>()

  return <div />
}

User.defaultProps = {
  max: 1,
}
```

---

## Union Type Props

```ts
type Props = {
  onClick?: (name: string) => void
} & (
  | {
      name: string
    }
  | {
      name: string[]
      max: number
    }
)
```

---

## `defaultProps`

- 需不需要使用 `defaultProps`
- 使用 `?` 还是 `!`

---

## Generic Component

```ts
interface Props<T = any> {
  rowKey: keyof T
}

function Table<T>(props: Props<T>) {
  return <div />
}
```

---

## HOC

```ts
function withStyle<T>(Comp: React.ComponentType<T>) {
  return class StyledComponent extends React.Component<
    T & { style: React.CSSProperties }
  > {
    render() {
      const { style, ...restProps } = this.props
      return (
        <div style={style}>
          <Comp {...(restProps as T)} />
        </div>
      )
    }
  }
}
```

---

## React Types

1. `React.ReactNode`
2. `React.CSSProperties`
3. `React.EventHandler`(`React.ChangeEventHandler`...)
4. `React.SyntheticEvent`(`React.ChangeEvent`...)

---

## Types

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never

type MyNonNullable<T> = T extends null | undefined ? never : T
// ((() => void) | undefined) extends null | undefined ? never : T
// (() => void extends null | undefined ? never : () => void) | (undefined extends null | undefined ? never : undefined)
```

---

## Custom Types

```ts
type Filter<T, C> = {
  [K in keyof {
    [K in keyof T]: T[K] extends C ? K : never
  }[keyof T]]: T[K]
}
```

---

## 类型收窄，`never` 关键字的使用

```ts
type ActionType = 'update' | 'delete'

function dispatch(type: ActionType) {
  switch (type) {
    case 'update':
      return 'update'
    case 'delete':
      return 'delete'
    default:
      return 'default'
  }
}
```

---

## Others

1. `is`(类型保护)
2. 面向对象
3. 函数重载
4. https://github.com/piotrwitek/utility-types
5. https://github.com/bsalex/typed-path
6. *https://github.com/typescript-cheatsheets/react*
7. *https://github.com/piotrwitek/react-redux-typescript-guide#--hoc-wrapping-a-component*

---

# Thanks