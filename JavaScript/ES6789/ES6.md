
## map

`Map` 对象保存键值对，能够记住键的原始插入顺序，任
何值（对象或者基本类型）都可以作为一个键或者一个值。

```JavaScript

const hashMap = new Map();

hashMap.set('a', 1);
hashMap.set('b', 2);
hashMap.set('c', 3);

console.log(hashMap.get('a')) // 1

hashMap.set('a', 2);
console.log(hashMap.get('a')) // 2

hashMap.delete('a')
console.log(hashMap.get('a')) // undefined

hashMap.size // 2

```

#### 键的相等

键的比较基于 `零值相等算法`

NaN 和 NaN 是相等的（虽然 NaN !== NaN），其他所有值都是根据 === 来判断的

#### Map 与 Object 区别

1. `Map` 默认不包括任何键，只包含显式插入的键， 一个 `Object` 有一个 原型，原型链上的键名可能和自定义的键名冲突，可用 `Object.create(null)` 创建一个无原型链的对象
2. `Map` 的键名可以是任意值（`NaN` 稍微特殊点），而 `Object` 的键名必须为 `String` 或者 `Symbol`
3. `Map` 的键是有顺序的，是按照插入的顺序排列的，`Object` 是无序的
4. `Map` 的长度可以直接通过 `size` 获取，`Object` 不行，`Object.keys(a).length`
5. `Map` 是可迭代的，可通过 for...of 遍历，Object 不行，可以通过 Object.keys、Object.entries、for...in 遍历
6. `Map` 在频繁增删键值对的场景下性能更好，Object 未对该场景做优化
7. `Map` 没有元素的序列化和解析的支持（但是你可以使用携带 replacer 参数的 JSON.stringify() 创建一个自己的对 Map 的序列化和解析支持，参考：https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map），Object 原生支持 stringify 和 parse