## 前端 AST 介绍，用法 -> 编译原理

1. 句子 -> 单词 token var const a = 123 词法分析 lexical analysis
2. 单词 -> 逐次翻译 var final 文法（es6 -> es5） 语法分析
3. 润色 数据结构 翻译成另一个数据结构  ast -> ast transform（代码转换） 最重要!!!
4. 合并生成产物 DOM tree


1. input -> token 词法分析
2. token -> parser ast 语法分析
3. ast -> transform -> newAst 代码转换
4. newAst -> generate -> output 生成代码过程


### 词法分析

```js
const input = `(add 2 (subtract 4 2))`

const out = `add(2, subtract(4, 2))`

// 词法分析

// DFS depth first search 深度优先遍历
function tokenizer(input) {
  let current = 0;
  let tokens = [];

  while(current < input.length) {
    let char = input[current];
    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '(',
      });
      current++;
      continue;
    }
    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      });
      current++;
      continue;
    }
    // 对于某一类比较小的点 正则
    let WHITE_SPACE = /\s/
    if (WHITE_SPACE.test(char)) {
      current++;
      continue;
    }
    let NUMBERS = /[0-9]/
    if(NUMBERS.test(char)) {
      let value = '';
      while(NUMBERS.test(char)) {
         value += char;
         char = input[++current];
      }
      tokens.push({
       type: 'number',
        value,
      });
      continue;
    }


    if (char === '"') {
       let value = '';
       char = input[++current]
       while(char !== '"') {
        value += char;
        char = input[++current];
       }
       tokens.push({
        type: 'string',
        value,
       });
    }

    let LETTERS = /[a-z]/i;
    if(LETTERS.test(char)) {
      let value = '';
      while(LETTERS.test(char)) {
         value += char;
         char = input[++current];
      }
      tokens.push({
        type: 'name',
        value,
      });
      continue;
    }
    throw new TypeError('不知道类型', char);
  }
  return tokens;
}

```

### 语法分析

```js
function parsers(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current];
    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }
    if (token.type === 'string') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }
    // 产生层级关系
    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];
      let node = {
        type: 'CallLiteral',
        name: token.value,
        params: [],
      };
      token = tokens[++current];
      while(token.type !== 'paren' || (token.type === 'paren' && token.value === ')')) {
        node.params.push(walk()) // 重点
        token = tokens[current];
      }
      current++;
      return node;
    }
  }
  let ast = {
    type: 'Program',
    body: [],
  };
  while(current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}

```

### 代码转换

> plugin 执行 钩子 visitor 观察者模式 visitor 钩子


```js
function traverser(ast, visitor) {
  function traverserArray(array, parent) {
  }

  function traverserNode(node, parent) {
    let methods = visitor[node.type];
    if (methods.enter) {
      methods.enter(node, parent);
    }

    if (methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverserNode(ast, null);
}

```
