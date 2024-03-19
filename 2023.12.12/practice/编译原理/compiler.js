
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

// 语法分析
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
        type: 'CallExpression',
        name: token.value,
        params: [],
      };
      token = tokens[++current];
      while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
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

// 代码转换

// plugin 执行 钩子 visitor 观察者模式 visitor 钩子
// webpack beforeStart end afterEnd enter exit
function traverser(ast, visitor) {
  // 前端 context 上下文
  function traverserArray(array, parent) {
    array.forEach((child) => {
      traverserNode(child, parent);
    });
  };
  function traverserNode(node, parent) {
    let methods = visitor(node.type);
    if (methods.enter) {
      methods.enter(node, parent);
    }

    // handle processing
    switch (node.type) {
      case 'Program':
        traverserArray(node.body, node);
        break;
      case 'CallExpression':
        traverserArray(node.params, node);
        break;
      case 'NumberLiteral':
      case 'StringLiteral':
        break;
      default:
        throw new TypeError(node.type);
    }
    if (methods.exit) {
      methods.exit(node, parent);
    }
  };
  traverserNode(ast, null);
};

// 代码生成
function codeGenerator(code) {
    // We'll break things down by the `type` of the `node`.
    switch (node.type) {

      // If we have a `Program` node. We will map through each node in the `body`
      // and run them through the code generator and join them with a newline.
      case 'Program':
        return node.body.map(codeGenerator)
          .join('\n');

      // For `ExpressionStatement` we'll call the code generator on the nested
      // expression and we'll add a semicolon...
      case 'ExpressionStatement':
        return (
          codeGenerator(node.expression) +
          ';' // << (...because we like to code the *correct* way)
        );

      // For `CallExpression` we will print the `callee`, add an open
      // parenthesis, we'll map through each node in the `arguments` array and run
      // them through the code generator, joining them with a comma, and then
      // we'll add a closing parenthesis.
      case 'CallExpression':
        return (
          codeGenerator(node.callee) +
          '(' +
          node.arguments.map(codeGenerator)
            .join(', ') +
          ')'
        );

      // For `Identifier` we'll just return the `node`'s name.
      case 'Identifier':
        return node.name;

      // For `NumberLiteral` we'll just return the `node`'s value.
      case 'NumberLiteral':
        return node.value;

      // For `StringLiteral` we'll add quotations around the `node`'s value.
      case 'StringLiteral':
        return '"' + node.value + '"';

      // And if we haven't recognized the node, we'll throw an error.
      default:
        throw new TypeError(node.type);
    }
};


