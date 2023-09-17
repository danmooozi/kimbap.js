const { transformFromAstSync, parseSync } = require("@babel/core");
const { Parser } = require("acorn");
const walk = require("acorn-walk");

const MyParser = Parser.extend();
const defaultParserOpts = { ecmaVersion: "latest", sourceType: "module" };

/**
 * Generate AST from content
 *
 * @param {string} content content
 * @returns {string} AST
 */
// const contentToAST = (content) => MyParser.parse(content, defaultParserOpts);
const contentToAST = (content) => parseSync(content);

/**
 * Retrieve import dependencies from AST
 *
 * @param {Object} ast AST
 * @returns {array} dependencies
 */
// const getDependencies = (ast) => {
//   const dependencies = [];
//   walk.simple(ast, {
//     ImportDeclaration: (node) => {
//       dependencies.push(node.source.value);
//     },
//   });

//   return dependencies;
// };
const getDependencies = (ast) => {
  return ast.program.body
    .filter((node) => node.type === "ImportDeclaration")
    .map((node) => node.source.value);
};

/**
 * Transform ES6 to ES5
 *
 * @param {Object} ast
 */
const transform = (ast) => {
  const { code } = transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"],
  });
  return code;
};

module.exports = {
  contentToAST,
  getDependencies,
  transform,
};
