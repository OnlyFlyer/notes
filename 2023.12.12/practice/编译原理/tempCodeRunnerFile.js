
const input  = '(add 2 (subtract 4 2))';
const output = 'add(2, subtract(4, 2));';

// 优先级的处理就是 DFS depth first search 深度优先遍历的过程
function tokenizer(input) {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let char = input.charAt(current);
    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '('
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
    let WHITESPACE = /\s/
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    let NUMBERS = /[0-9]/
    if (NUMBERS.test(char)) {
      let value = '';
      while (NUMBERS.test(char)) {
        value += char;
        current++;
        char = input[current];
      }
      tokens.push({
        type: 'number',
        value,
      });
      continue;
    }

    if (char === '"') {
      let value = '';
      current++;
      char = input[current];
      while (char !== '"') {
        value += char;
        current++;
        char = input[current];
      }

      current++;
      char = input[current];

      tokens.push({
        type: 'string',
        value,
      });
      continue;
    }

    let LETTERS = /[a-z]/
    if (LETTERS.test(char)) {
      let value = '';
      while (LETTERS.test(char)) {
        value += char;
        current++;
        char = input[current];
      }
      tokens.push({
        type: 'name',
        value,
      });
      continue;
    }
    throw new TypeError('未知类型!', char);
  };
  console.log(tokens, '--tokens');
  return tokens;
};

function parser(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current];
    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value:  token.value,
      };
    }
    if (token.type === 'string') {
      current++;
      return {
        type: 'StringLiteral',
        value:  token.value,
      };
    }
    // 层级关系
    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];
      let node = {
        type: 'CallLiteral',
        name: token.value,
        params: [],
      };
      token = tokens[++current];
      while (token.type !== 'paren' || (token.type === 'paren' && token.type !== ')')) {
        node.params.push(walk()); // 重点
        token = tokens[current];
      }
      current++;
      return node;
    }
  };
  let ast = {
    type: 'Program',
    body: [],
  };
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  console.log(ast, '--ast');
  return ast;
};

const tokens = tokenizer(input);
const ast = parser(tokens);
