<section id="nice" data-tool="mdnice编辑器" data-website="https://www.mdnice.com" style="font-size: 16px; color: black; padding: 0 10px; line-height: 1.6; word-spacing: 0px; letter-spacing: 0px; word-break: break-word; word-wrap: break-word; text-align: left; font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;"><h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px;"><span class="prefix" style="display: none;"></span><span class="content">前言</span><span class="suffix"></span></h2>
<blockquote class="multiquote-1" data-tool="mdnice编辑器" style="border: none; display: block; font-size: 0.9em; overflow: auto; overflow-scrolling: touch; border-left: 3px solid rgba(0, 0, 0, 0.4); background: rgba(0, 0, 0, 0.05); color: #6a737d; padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 10px; margin-bottom: 20px; margin-top: 20px;">
<p style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0px; color: black; line-height: 26px;">在 H5 日常开发中，会经常遇到列表点击进入详情然后返回列表的情况，与 APP 不同，APP 是一层层的 View，盖在 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">LastPage</code> 上，天然就能够保存上一个页面的状态，而 H5 不同，从详情返回到列表的状态都会被清除掉，重新走一遍生命周期，若列表很长，点击详情再返回列表回到顶部就很影响用户体验，因此做列表缓存是必须的，后面附 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">CacheHoc</code> 实现。</p>
</blockquote>
<h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px;"><span class="prefix" style="display: none;"></span><span class="content">思考</span><span class="suffix"></span></h2>
<p data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black;">缓存缓存，无外乎就是两件事，页面离开的时候存数据，再次进入的时候取数据，那何时存，存在哪？何时取，在哪取？</p>
<h4 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 18px;"><span class="prefix" style="display: none;"></span><span class="content">何时存</span><span class="suffix" style="display: none;"></span></h4>
<p data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black;">这个问题很简单，当然是页面即将销毁的时候存，也就是 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">componentWillUnmount</code> 生命周期内进行存操作。</p>
<h4 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 18px;"><span class="prefix" style="display: none;"></span><span class="content">存在哪</span><span class="suffix" style="display: none;"></span></h4>
<ol data-tool="mdnice编辑器" style="margin-top: 8px; margin-bottom: 8px; padding-left: 25px; color: black; list-style-type: decimal;">
<li><section style="margin-top: 5px; margin-bottom: 5px; line-height: 26px; text-align: left; color: rgb(1,1,1); font-weight: 500;">如果是数据持久化可存到 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">url</code> 或 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">localStorage</code> 中，其中 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">url</code> 可以先 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">pass</code> 掉，因为在复杂列表的情况下，需要存的数据比较多，全部放到 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">url</code> 上会让 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">url</code> 冗长，显然不妥，<code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">localStorage</code> 是一种方式，提供的 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">getItem</code>、<code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">setItem</code> 等 api 也足够支持存取操作，最大支持 5M，容量也够，还可通过序列化 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">Serialize</code> 整合.</section></li><li><section style="margin-top: 5px; margin-bottom: 5px; line-height: 26px; text-align: left; color: rgb(1,1,1); font-weight: 500;">内存，对于不需要做持久化的列表或数据来说，放内存可能是一个更好的方式，为什么这样说，举个例子，从list -&gt; detail -&gt; list 需要缓存没问题，但是用户返回到主页再次进入 list 从逻辑上来说就不应该在用之前缓存的数据了，因此，可以放到 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">redux</code> 或 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">rematch</code> 等状态管理工具中，封装一些存取方法，很方便，或者是放到全局的 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">window</code> 中。</section></li></ol>
<h4 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 18px;"><span class="prefix" style="display: none;"></span><span class="content">何时取</span><span class="suffix" style="display: none;"></span></h4>
<p data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black;">这个问题也很简单，是在进入页面的时候取，但是需要注意的是，只在 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">POP</code> 的时候取，因为每当我们 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">PUSH</code> 时，都应当进入一个新的页面，这种情况是不应该用缓存数据的。</p>
<h4 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 18px;"><span class="prefix" style="display: none;"></span><span class="content">在哪取</span><span class="suffix" style="display: none;"></span></h4>
<p data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black;">--</p>
<h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px;"><span class="prefix" style="display: none;"></span><span class="content"><code>CacheHoc</code> 的缓存方案</span><span class="suffix"></span></h2>
<p data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black;"><code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">CacheHoc</code> 是一个高阶组件，缓存数据统一存到 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">window</code> 内，外部仅需要传入 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">CACHE_NAME</code>，<code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">scrollElRefs</code> 即可，<code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">CACHE_NAME</code> 相当于缓存数据的 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">key</code>，而 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">scrollElRefs</code> 则是一个包含滚动容器的数组，为啥用数组呢，是考虑到页面多个滚动容器的情况，在 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">componentWillUnmount</code> 生命周期函数中记录对应滚动容器的 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">scrollTop</code>、<code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">state</code>，在 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">constructor</code> 内初始化 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">state</code>，在 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">componentDidMount</code> 中更新 <code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; color: #1e6bb8; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all;">scrollTop</code>。</p>
<h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px;"><span class="prefix" style="display: none;"></span><span class="content">简单使用</span><span class="suffix"></span></h2>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://files.mdnice.com/point.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #282c34; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #abb2bf; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #282c34; border-radius: 5px;"><span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">import</span> React <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">from</span> <span class="hljs-string" style="color: #98c379; line-height: 26px;">'react'</span>
<span/><span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">import</span> { connect } <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">from</span> <span class="hljs-string" style="color: #98c379; line-height: 26px;">'react-redux'</span>
<span/><span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">import</span> cacheHoc <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">from</span> <span class="hljs-string" style="color: #98c379; line-height: 26px;">'utils/cache_hoc'</span>
<span/>
<span/><span class="hljs-meta" style="color: #61aeee; line-height: 26px;">@connect</span>(mapStateToProps, mapDispatch)
<span/><span class="hljs-meta" style="color: #61aeee; line-height: 26px;">@cacheHoc</span>
<span/><span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">export</span> <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">default</span> <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">class</span> <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">extends</span> React.Component {
<span/>  <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">constructor</span> (<span class="hljs-params" style="line-height: 26px;">...props</span>) {
<span/>    <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">super</span>(...props)
<span/>    <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.props.withRef(<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>)
<span/>  }
<span/>
<span/>  <span class="hljs-comment" style="color: #5c6370; font-style: italic; line-height: 26px;">// 设置 CACVHE_NAME</span>
<span/>  CACHE_NAME = <span class="hljs-string" style="color: #98c379; line-height: 26px;">`customerList<span class="hljs-subst" style="color: #e06c75; line-height: 26px;">${<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.props.index}</span>`</span>;
<span/>  
<span/>  scrollDom = <span class="hljs-literal" style="color: #56b6c2; line-height: 26px;">null</span>
<span/>
<span/>  state = {
<span/>    orderBy: <span class="hljs-string" style="color: #98c379; line-height: 26px;">'2'</span>,
<span/>    loading: <span class="hljs-literal" style="color: #56b6c2; line-height: 26px;">false</span>,
<span/>    num: <span class="hljs-number" style="color: #d19a66; line-height: 26px;">1</span>,
<span/>    dataSource: [],
<span/>    keyWord: <span class="hljs-literal" style="color: #56b6c2; line-height: 26px;">undefined</span>
<span/>  }
<span/>
<span/>  componentDidMount () {
<span/>    <span class="hljs-comment" style="color: #5c6370; font-style: italic; line-height: 26px;">// 设置滚动容器list</span>
<span/>    <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.scrollElRefs = [<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.scrollDom]
<span/>    <span class="hljs-comment" style="color: #5c6370; font-style: italic; line-height: 26px;">// 请求数据，更新 state</span>
<span/>  }
<span/>
<span/>  render () {
<span/>    <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> { history } = <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.props
<span/>    <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> { dataSource, orderBy, loading } = <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.state
<span/>
<span/>    <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">return</span> (
<span/>      &lt;div className={gcmc(<span class="hljs-string" style="color: #98c379; line-height: 26px;">'wrapper'</span>)}&gt;
<span/>        &lt;MeScroll
<span/>          className={gcmc(<span class="hljs-string" style="color: #98c379; line-height: 26px;">'wrapper'</span>)}
<span/>          getMs={<span class="hljs-function" style="line-height: 26px;"><span class="hljs-params" style="line-height: 26px;">ref</span> =&gt;</span> (<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.scrollDom = ref)}
<span/>          loadMore={<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.fetchData}
<span/>          refresh={<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.refresh}
<span/>          up={{
<span/>            page: {
<span/>              num: <span class="hljs-number">1</span>, <span class="hljs-comment">// 当前页码,默认0,回调之前会加1,即callback(page)会从1开始</span>
<span/>              size: <span class="hljs-number">15</span> <span class="hljs-comment">// 每页数据的数量</span>
<span/>              <span class="hljs-comment">// time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;</span>
<span/>            }
<span/>          }}
<span/>          down={{ auto: <span class="hljs-literal">false</span> }}
<span/>        &gt;
<span/>          {loading ? (
<span/>            &lt;div className={gcmc(<span class="hljs-string" style="color: #98c379; line-height: 26px;">'loading-wrapper'</span>)}&gt;
<span/>              &lt;Loading /&gt;
<span/>            &lt;<span class="hljs-regexp" style="color: #98c379; line-height: 26px;">/div&gt;
<span/>          ) : (
<span/>            dataSource.map(item =&gt; (
<span/>              &lt;Card
<span/>                key={item.clienteleId}
<span/>                data={item}
<span/>                {...this.props}
<span/>                onClick={() =&gt;
<span/>                  history.push('/</span>detail/id<span class="hljs-string" style="color: #98c379; line-height: 26px;">')
<span/>                }
<span/>              /&gt;
<span/>            ))
<span/>          )}
<span/>        &lt;/MeScroll&gt;
<span/>        &lt;div className={styles['</span>sort<span class="hljs-string" style="color: #98c379; line-height: 26px;">']}&gt;
<span/>          &lt;div className={styles['</span>sort-wrapper<span class="hljs-string" style="color: #98c379; line-height: 26px;">']} onClick={this._toSort}&gt;
<span/>            &lt;span style={{ marginRight: 3 }}&gt;最近下单时间&lt;/span&gt;
<span/>            &lt;img
<span/>              src={orderBy === '</span><span class="hljs-number" style="color: #d19a66; line-height: 26px;">2</span><span class="hljs-string" style="color: #98c379; line-height: 26px;">' ? SORT_UP : SORT_DOWN}
<span/>              alt='</span>sort<span class="hljs-string" style="color: #98c379; line-height: 26px;">'
<span/>              style={{ width: 10, height: 16 }}
<span/>            /&gt;
<span/>          &lt;/div&gt;
<span/>        &lt;/div&gt;
<span/>      &lt;/div&gt;
<span/>    )
<span/>  }
<span/>}
<span/>
<span/></span></code></pre>
<p data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black;">效果如下:</p>
<figure data-tool="mdnice编辑器" style="margin: 0; margin-top: 10px; margin-bottom: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center;"><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f73d3eced1764a8da3d9f4ce39ed0e64~tplv-k3u1fbpfcp-watermark.image" alt style="display: block; margin: 0 auto; max-width: 100%;"></figure>
<p data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black;">缓存的数据:</p>
<figure data-tool="mdnice编辑器" style="margin: 0; margin-top: 10px; margin-bottom: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center;"><img src="https://imgkr2.cn-bj.ufileos.com/7778d4e4-2d47-477b-9d49-4afdc1dd36cd.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&amp;Signature=UzF%252B3meMwe1U9Oe3alJEif3v%252BaU%253D&amp;Expires=1604417321" alt style="display: block; margin: 0 auto; max-width: 100%;"></figure>
<h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px;"><span class="prefix" style="display: none;"></span><span class="content">代码</span><span class="suffix"></span></h2>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://files.mdnice.com/point.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #282c34; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #abb2bf; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #282c34; border-radius: 5px;"><span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> storeName = <span class="hljs-string" style="color: #98c379; line-height: 26px;">'CACHE_STORAGE'</span>
<span/><span class="hljs-built_in" style="color: #e6c07b; line-height: 26px;">window</span>[storeName] = {}
<span/>
<span/><span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">export</span> <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">default</span> Comp =&gt; {
<span/>  <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">return</span> <span class="hljs-class" style="line-height: 26px;"><span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">class</span> <span class="hljs-title" style="color: #e6c07b; line-height: 26px;">CacheWrapper</span> <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">extends</span> <span class="hljs-title" style="color: #e6c07b; line-height: 26px;">Comp</span> </span>{
<span/>    <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">constructor</span> (props) {
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">super</span>(props)
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">if</span> (!<span class="hljs-built_in" style="color: #e6c07b; line-height: 26px;">window</span>[storeName][<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.CACHE_NAME]) {
<span/>        <span class="hljs-comment" style="color: #5c6370; font-style: italic; line-height: 26px;">// 根据 CACHE_NAME 初始化缓存 key </span>
<span/>        <span class="hljs-built_in" style="color: #e6c07b; line-height: 26px;">window</span>[storeName][<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.CACHE_NAME] = {}
<span/>      }
<span/>      <span class="hljs-comment" style="color: #5c6370; font-style: italic; line-height: 26px;">// 用于存 state 等信息</span>
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.store = <span class="hljs-built_in" style="color: #e6c07b; line-height: 26px;">window</span>[storeName][<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.CACHE_NAME]
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> { <span class="hljs-attr" style="color: #d19a66; line-height: 26px;">history</span>: { action } = {} } = props
<span/>      <span class="hljs-comment" style="color: #5c6370; font-style: italic; line-height: 26px;">// 只有返回&amp;state中有值的情况才初始化 state</span>
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">if</span> (action === <span class="hljs-string" style="color: #98c379; line-height: 26px;">'POP'</span>) {
<span/>        <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> { state } = <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.store
<span/>        <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">if</span> (state) {
<span/>          <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.state = state
<span/>        }
<span/>      } <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">else</span> {
<span/>        <span class="hljs-comment" style="color: #5c6370; font-style: italic; line-height: 26px;">// 再次进来的时候，也就是从首页进入列表，清空上一次缓存的信息</span>
<span/>        <span class="hljs-built_in" style="color: #e6c07b; line-height: 26px;">window</span>[storeName][<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.CACHE_NAME] = {}
<span/>        <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.store = <span class="hljs-built_in" style="color: #e6c07b; line-height: 26px;">window</span>[storeName][<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.CACHE_NAME]
<span/>      }
<span/>    }
<span/>
<span/>    <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">async</span> componentDidMount () {
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">if</span> (<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">super</span>.componentDidMount) {
<span/>        <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">await</span> <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">super</span>.componentDidMount()
<span/>      }
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> { <span class="hljs-attr" style="color: #d19a66; line-height: 26px;">history</span>: { action } = {} } = <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.props
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">if</span> (action !== <span class="hljs-string" style="color: #98c379; line-height: 26px;">'POP'</span>) <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">return</span>
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> { scrollTops = [] } = <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.store
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> { scrollElRefs = [] } = <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>
<span/>      scrollElRefs.forEach(<span class="hljs-function" style="line-height: 26px;">(<span class="hljs-params" style="line-height: 26px;">el, index</span>) =&gt;</span> {
<span/>        <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">if</span> (el &amp;&amp; el.scrollTop !== <span class="hljs-literal" style="color: #56b6c2; line-height: 26px;">undefined</span>) {
<span/>          el.scrollTop = scrollTops[index]
<span/>        }
<span/>      })
<span/>    }
<span/>
<span/>    componentWillUnmount () {
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">if</span> (<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">super</span>.componentWillUnmount) {
<span/>        <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">super</span>.componentWillUnmount()
<span/>      }
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.store.state = <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.state
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> scrollTops = []
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">const</span> { scrollElRefs = [] } = <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>
<span/>      scrollElRefs.forEach(<span class="hljs-function" style="line-height: 26px;"><span class="hljs-params" style="line-height: 26px;">ref</span> =&gt;</span> {
<span/>        <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">if</span> (ref &amp;&amp; ref.scrollTop !== <span class="hljs-literal" style="color: #56b6c2; line-height: 26px;">undefined</span>) {
<span/>          scrollTops.push(ref.scrollTop)
<span/>        }
<span/>      })
<span/>      <span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">this</span>.store.scrollTops = scrollTops
<span/>    }
<span/>  }
<span/>}
<span/>
<span/></code></pre>
<h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px;"><span class="prefix" style="display: none;"></span><span class="content">总结</span><span class="suffix"></span></h2>
<p data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black;">其实缓存的方式都大同小异，就上文说的几点，具体采用的方案要根据实际应用场景来选择，重要的是分析存取的时机和位置，实现只是将脑中的逻辑写出来而已。</p>
<p id="nice-suffix-juejin-container" class="nice-suffix-juejin-container" data-tool="mdnice编辑器" style="font-size: 16px; padding-top: 8px; padding-bottom: 8px; margin: 0; line-height: 26px; color: black; margin-top: 20px !important;">本文使用 <a href="https://mdnice.com/?from=juejin" style="text-decoration: none; color: #1e6bb8; word-wrap: break-word; font-weight: bold; border-bottom: 1px solid #1e6bb8;">mdnice</a> 排版</p></section>