
在很多支付或者表单提交的场景下，经常会出现用户多次点击按钮导致表单重复提交，即使服务端做了幂等，也有出现重复提交的几率，因此前后端联合起来做了一个防重复提交的方案，只要配置了防重复的接口，除参数外还需请求头 `header` 加一个 `rp-check-tk:${token}` 字段，服务端提供一个一个获取 `token` 的接口，只要在每次提交数据时将 `token` 附带到 `header` 上，若该 `token` 未被消费，则每次获取的 `token` 都是一样的，当发起了不带 `token` 或者 带有重复 `token` 的请求时，服务端直接返回 `false`，从而保证了数据提交的唯一性，具体见下图。


![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bb163f64538440e8e325d4176b8b673~tplv-k3u1fbpfcp-watermark.image)


另外，还有一种场景是页面提交表单后跳转的情况，这种情况下限制获取 `token` 接口一次，这样的话即使在跳转前再次点击了按钮也会因 `token` 失效而失败。

```ts

// 维护一个 api 状态池，目前就一个 loading，后续还可以加别的配置，
// 代表该 api 的请求状态，初始时将传入的 api loading 设置为 true，
// 若 loading 为 true，直接 return，每次请求完后重新请求 token 接口

// fn component
import { useState, useCallback, useEffect, useRef } from 'react';

import { request, RequestProps } from '../libs/request';

const TOEKN_URL = 'get token api';

export interface AvoidRepeatHookProps {
  justOnce?: boolean;
}

export const useAvoidRepeatHook = (p: AvoidRepeatHookProps) => {
  const tokenRef = useRef<string | undefined>(undefined);
  const requestNumsRef = useRef<number>(0);
  const [pool, setPool] = useState<any>({});

  const { justOnce = false } = p;

  const initToken = useCallback(async () => {
    // 如果只允许发起一次请求且已经请求过一次了，直接返回，不再获取 token
    if (!!justOnce && requestNumsRef.current >= 1) return;
    try {
      const res = await request({ api: TOEKN_URL });
      tokenRef.current = res.token;
      requestNumsRef.current = requestNumsRef.current + 1;
    } catch (err) {}
  }, []);

  const destroyToken = useCallback(() => {
    tokenRef.current = undefined;
  }, []);

  const retryToken = useCallback(() => {
    initToken();
  }, [initToken]);

  const post = async ({ api, headers = {}, ...rest }: RequestProps) =>
    new Promise((resolve, reject) => {
      if (!api) return;
      if (!pool[api]) {
        setPool({ ...pool, [api]: { loading: true } });
      } else {
        if (pool[api].loading) return;
      }
      const p = { api, ...rest };
      if (tokenRef.current) {
        Object.assign(p, {
          headers: { ...(headers || {}), 'rp-check-tk': tokenRef.current },
        });
      }
      request(p)
        .then((data: any) => resolve(data))
        .catch((err: any) => reject(err))
        .finally(() => {
          setPool({ ...pool, [api]: { loading: false } });
          tokenRef.current = undefined;
          if (!!justOnce) return;
          initToken();
        });
    });
  useEffect(() => {
    initToken();
  }, [initToken]);
  return {
    token: tokenRef.current,
    post,
    destroyToken,
    retryToken,
    pool,
  };
};


```

```ts
// useage
import { Component, useState, useCallback, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button } from 'antd'


export default (props: RouteComponentProps) => {
  const { post } = useAvoidRepeatHook({ justOnce: false })
  const handleClick = () => {
    post({ query: {} })
    .then((data: any) => {
      console.log('data:', data)
    })
    .catch((err: any) => {
      console.log('err:', err)
    })
  }
  return (
    <div>
      <Button type='link' onClick={handleClick}>点击</Button>
    </div>
  )
}

```

```ts

// class Component
import { Component } from 'react';

import { request, RequestProps } from '../libs/request';

const TOEKN_URL = 'get toekn api';

export interface AvoidRepeatCompState {
  avoidRepeatToken: string | undefined;
  pool: any;
  fetchTokenNums: number;
}

export class AvoidRepeatBaseComponent extends Component {
  state: AvoidRepeatCompState = {
    avoidRepeatToken: undefined,
    pool: {},
    fetchTokenNums: 0,
  };

  public justOnce = false;

  async initToken() {
    const { fetchTokenNums } = this.state;
    const { justOnce } = this;
    // 如果只允许发起一次请求且已经请求过一次了，直接返回，不再获取 token
    if (!!justOnce && fetchTokenNums >= 1) return;
    try {
      const { token } = await request({ api: TOEKN_URL });
      this.setState({
        avoidRepeatToken: token,
        fetchTokenNums: fetchTokenNums + 1,
      });
    } catch (err) {}
  }

  retryToken() {
    this.initToken();
  }

  destroyToken() {
    this.setState({ avoidRepeatToken: undefined });
  }

  componentDidMount() {
    this.initToken();
  }

  post = ({ api, headers = {}, ...rest }: RequestProps) =>
    new Promise((resolve, reject) => {
      const { avoidRepeatToken, pool } = this.state;
      if (!api) return;
      if (!pool[api]) {
        this.setState({
          pool: { ...pool, [api]: { loading: true } },
        });
      } else {
        if (pool[api].loading) return;
      }
      const p = { api, ...rest };
      if (avoidRepeatToken) {
        Object.assign(p, {
          headers: { ...(headers || {}), 'rp-check-tk': avoidRepeatToken },
        });
      }
      request(p)
        .then((data: any) => resolve(data))
        .catch((err: any) => reject(err))
        .finally(() => {
          this.setState(
            {
              pool: {
                ...pool,
                [api]: { loading: false },
              },
              avoidRepeatToken: undefined,
            },
            () => {
              this.initToken();
            },
          );
        });
    });
}


```

```js
// useage
import { Component } from 'react';

export class extends AvoidRepeatBaseComponent {
  justOnce = false;
  handleRepeat = async () => {
    try {
      const { post } = this;
      const res = await post({
        api: 'kasjgjkadg',
        query: {}
      });
      console.log('res:', res);
    } catch (err) {}
  };
  render() {
    return <div onClick={this.handleRepeat}>AvoidRepeat Component</div>;
  }
}

```

思考：由于现在的机制是每次请求完都重新请求获取 `token` 的接口，如果频繁点击，会出现多次获取 `token` 的情况，怎么避免这种情况？

1. 在接口返回时，让服务端将 `token` 状态也一并返回，前端做一个逻辑判断，只有在 `token` 被正常消费的情况才去请求 `token`，而不是无脑请求。