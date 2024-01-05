export function thunk ({ dispatch, getState }) {
  return (next) => (action) => {
    if (typeof action === 'function') {
      action(dispatch, getState())
    }
    next(action)
  }
}

function* fibonacciGeneratorFunction(a = 1, b = 1) {
  yield a;
  yield* fibonacciGeneratorFunction(b, b + a);
}

const fn = fibonacciGeneratorFunction()
console.log(fn.next())
console.log(fn.next())
console.log(fn.next())
console.log(fn.next())
console.log(fn.next())
console.log(fn.next())
console.log(fn.next())
