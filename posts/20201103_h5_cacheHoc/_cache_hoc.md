## 前言

> 在 H5 日常开发中，会经常遇到列表点击进入详情然后返回列表的情况，与 APP 不同，APP 是一层层的 View，盖在 `LastPage` 上，天然就能够保存上一个页面的状态，而 H5 不同，从详情返回到列表的状态都会被清除掉，重新走一遍生命周期，若列表很长，点击详情再返回列表回到顶部就很影响用户体验，因此做列表缓存是必须的，后面附 `CacheHoc` 实现。

## 思考

缓存缓存，无外乎就是两件事，页面离开的时候存数据，再次进入的时候取数据，那何时存，存在哪？何时取，在哪取？

#### 何时存

这个问题很简单，当然是页面即将销毁的时候存，也就是 `componentWillUnmount` 生命周期内进行存操作。

#### 存在哪

1. 如果是数据持久化可存到 `url` 或 `localStorage` 中，其中 `url` 可以先 `pass` 掉，因为在复杂列表的情况下，需要存的数据比较多，全部放到 `url` 上会让 `url` 冗长，显然不妥，`localStorage` 是一种方式，提供的 `getItem`、`setItem` 等 api 也足够支持存取操作，最大支持 5M，容量也够，还可通过序列化 `Serialize` 整合.
2. 内存，对于不需要做持久化的列表或数据来说，放内存可能是一个更好的方式，为什么这样说，举个例子，从list -> detail -> list 需要缓存没问题，但是用户返回到主页再次进入 list 从逻辑上来说就不应该在用之前缓存的数据了，因此，可以放到 `redux` 或 `rematch` 等状态管理工具中，封装一些存取方法，很方便，或者是放到全局的 `window` 中。

#### 何时取

这个问题也很简单，是在进入页面的时候取，但是需要注意的是，只在 `POP` 的时候取，因为每当我们 `PUSH` 时，都应当进入一个新的页面，这种情况是不应该用缓存数据的。 

#### 在哪取

--


## `CacheHoc` 的缓存方案

`CacheHoc` 是一个高阶组件，缓存数据统一存到 `window` 内，外部仅需要传入 `CACHE_NAME`，`scrollElRefs` 即可，`CACHE_NAME` 相当于缓存数据的 `key`，而 `scrollElRefs` 则是一个包含滚动容器的数组，为啥用数组呢，是考虑到页面多个滚动容器的情况，在 `componentWillUnmount` 生命周期函数中记录对应滚动容器的 `scrollTop`、`state`，在 `constructor` 内初始化 `state`，在 `componentDidMount` 中更新 `scrollTop`。

## 简单使用

```ts
import React from 'react'
import { connect } from 'react-redux'
import cacheHoc from 'utils/cache_hoc'

@connect(mapStateToProps, mapDispatch)
@cacheHoc
export default class extends React.Component {
  constructor (...props) {
    super(...props)
    this.props.withRef(this)
  }

  // 设置 CACVHE_NAME
  CACHE_NAME = `customerList${this.props.index}`;
  
  scrollDom = null

  state = {
    orderBy: '2',
    loading: false,
    num: 1,
    dataSource: [],
    keyWord: undefined
  }

  componentDidMount () {
    // 设置滚动容器list
    this.scrollElRefs = [this.scrollDom]
    // 请求数据，更新 state
  }

  render () {
    const { history } = this.props
    const { dataSource, orderBy, loading } = this.state

    return (
      <div className={gcmc('wrapper')}>
        <MeScroll
          className={gcmc('wrapper')}
          getMs={ref => (this.scrollDom = ref)}
          loadMore={this.fetchData}
          refresh={this.refresh}
          up={{
            page: {
              num: 1, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
              size: 15 // 每页数据的数量
              // time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
            }
          }}
          down={{ auto: false }}
        >
          {loading ? (
            <div className={gcmc('loading-wrapper')}>
              <Loading />
            </div>
          ) : (
            dataSource.map(item => (
              <Card
                key={item.clienteleId}
                data={item}
                {...this.props}
                onClick={() =>
                  history.push('/detail/id')
                }
              />
            ))
          )}
        </MeScroll>
        <div className={styles['sort']}>
          <div className={styles['sort-wrapper']} onClick={this._toSort}>
            <span style={{ marginRight: 3 }}>最近下单时间</span>
            <img
              src={orderBy === '2' ? SORT_UP : SORT_DOWN}
              alt='sort'
              style={{ width: 10, height: 16 }}
            />
          </div>
        </div>
      </div>
    )
  }
}

```

效果如下:

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f73d3eced1764a8da3d9f4ce39ed0e64~tplv-k3u1fbpfcp-watermark.image)

缓存的数据:

![](https://imgkr2.cn-bj.ufileos.com/7778d4e4-2d47-477b-9d49-4afdc1dd36cd.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=UzF%252B3meMwe1U9Oe3alJEif3v%252BaU%253D&Expires=1604417321)

## 代码


```js
const storeName = 'CACHE_STORAGE'
window[storeName] = {}

export default Comp => {
  return class CacheWrapper extends Comp {
    constructor (props) {
      super(props)
      if (!window[storeName][this.CACHE_NAME]) {
        // 根据 CACHE_NAME 初始化缓存 key 
        window[storeName][this.CACHE_NAME] = {}
      }
      // 用于存 state 等信息
      this.store = window[storeName][this.CACHE_NAME]
      const { history: { action } = {} } = props
      // 只有返回&state中有值的情况才初始化 state
      if (action === 'POP') {
        const { state } = this.store
        if (state) {
          this.state = state
        }
      } else {
        // 再次进来的时候，也就是从首页进入列表，清空上一次缓存的信息
        window[storeName][this.CACHE_NAME] = {}
        this.store = window[storeName][this.CACHE_NAME]
      }
    }

    async componentDidMount () {
      if (super.componentDidMount) {
        await super.componentDidMount()
      }
      const { history: { action } = {} } = this.props
      if (action !== 'POP') return
      const { scrollTops = [] } = this.store
      const { scrollElRefs = [] } = this
      scrollElRefs.forEach((el, index) => {
        if (el && el.scrollTop !== undefined) {
          el.scrollTop = scrollTops[index]
        }
      })
    }

    componentWillUnmount () {
      if (super.componentWillUnmount) {
        super.componentWillUnmount()
      }
      this.store.state = this.state
      const scrollTops = []
      const { scrollElRefs = [] } = this
      scrollElRefs.forEach(ref => {
        if (ref && ref.scrollTop !== undefined) {
          scrollTops.push(ref.scrollTop)
        }
      })
      this.store.scrollTops = scrollTops
    }
  }
}

```

## 总结

其实缓存的方式都大同小异，就上文说的几点，具体采用的方案要根据实际应用场景来选择，重要的是分析存取的时机和位置，实现只是将脑中的逻辑写出来而已。