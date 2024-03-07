let hookState: Array<any> = [];
let hookIndex = 0;

// useMemo
function useMemo(fn, deps) {
  // 非首次渲染
  if (hookState[0]) {
    const [lastValue, lastDeps] = hookState[0];
    const hasSame = deps.every((item, index) => item === lastDeps[index]);
    if (hasSame) {
      return lastValue;
    }
  }
  const result = fn();
  hookState = [result, deps];
  return result;
};

function memoWrapper() {
  let cacheState: Array<any> = [];
  return function realMemoFn(fn, deps) {
    if (cacheState[0]) {
      const [lastValue, lastDeps] = cacheState[0];
      const hasSame = deps.every((item, index) => item === lastDeps[index]);
      if (hasSame) {
        return lastValue;
      }
    }
    const result = fn();
    console.log('重新计算过');
    cacheState = [[result, deps]];
    return result;

  };
};

const MyMemo = memoWrapper();

const b = MyMemo(() => {
// @ts-ignore
  return a + b;
// @ts-ignore
}, [a, b]);

// useCallback
function useCallback(callback, deps) {
  // 说明不是第一次渲染
  if (hookState[hookIndex]) {
    let [lastCb, lastDeps] = hookState[hookIndex];
    const same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastCb;
    }
  }
  // 第一次渲染 或者 不是第一次但是依赖项相同，都返回新的
  hookState[hookIndex] = [callback, deps];
  hookIndex++;
  return callback;
};


let cache: Array<{ cacheCb: Function, cacheDeps: any[] }> = [];
let index: number = 0;
function xxCallback(callback, deps) {
  if (cache.length) {
    const { cacheCb, cacheDeps } = cache[index];
    const hasSame = deps.every((item, index) => item === cacheDeps[index]);
    if (hasSame) {
      index++;
      return cacheCb;
    }
  }
  cache[index] = { cacheCb: callback, cacheDeps: deps };
  index++;
  return callback;
};

// memorize
// function memorize(f) {
// 	if (!f.cache) f.cache = {};
// 	return function() {
// 		var cacheId = [].slice.call(arguments).join('');
// 		console.log(this);
// 		return f.cache[cacheId] ?
// 				f.cache[cacheId] :
// 				f.cache[cacheId] = f.apply(window, arguments);
// 	};
// }

function MyMemorize(fn) {
  if (!fn.cache) fn.cache = new Map();
  return function() {
    const args = [...arguments];
    const cacheId = args.join('');
    if (fn.cache[cacheId]) return fn.cache[cacheId];
    const result = fn(...args);
    fn.cache[cacheId] = result;
    return result;
  };
};
