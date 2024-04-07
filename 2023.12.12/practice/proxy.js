// Proxy 和 Object.defineProperty

// Object.defineProperty 的缺点：

// 1. 只能监听已有的属性，无法监听对象属性的新增和删除
let num = 3
const cat = { name: '大橘', sex: 'boy', age: 5 }
Object.defineProperty(cat,'age',{
    get() {
        console.log('get value')
        return num
    },
    set(val) {
        console.log('set value', val)
        num = val
    }
})
cat.age = 6 // 可以被监听到
cat.breed = '狸花猫' // 新增属性 breed，无法被监听到

// 2. 无法监听数组下标的变化，通过数组下标修改元素，无法实时响应。基于性能
// 考虑vue2放弃了Object.defineProperty这一特性，如果数组长度过大，比
// 如1000条，性能代价和用户体验收益不成正比

// 若需要劫持数组，那么就需要初始化长一点的数组，但是初始化长度是无法确定的

// 3. 只能劫持对象的属性，所以我们需要对每个对象的所有属性进行
// 遍历，然后需要深拷贝进行修改而Proxy可以监听对象而非属性，相
// 比前者具有更好的性能

const arr = [1,2,3];
const p = new Proxy(arr, {
    get(target, propName, z) {
        console.log(target, propName, z, '--get');
        return target[propName];
    },
    set(target, propName, newValue, z) {
        console.log(target, propName, newValue, z, '--set');
        target[propName] = newValue;
    }
});
p[0] // [1,2,3]  '0'  p
p[0] = 2 // [1,2,3] '0' 2  p

const obj = { a: 1, b: 2, c: 3 };
const o = new Proxy(obj, {
    get(target, propName, z) {
        console.log(target, propName, z, '--get');
        return target[propName];
    },
    set(target, propName, newValue, z) {
        console.log(target, propName, newValue, z, '--set');
        target[propName] = newValue;
    },
    has(target, propName) {
        console.log(propName, '--has');
        if (propName === 'a') return false;
        return true;
    },
});
