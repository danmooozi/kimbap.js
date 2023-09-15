const fs = require("fs");
// tokenize 해서 종류별로 나누어줌
const esprima = require("esprima");

function createAST(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const ast = esprima.parseModule(code);
  return ast;
}

const ast = createAST("src/index.js");
console.log(JSON.stringify(ast, null, 2));
