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
const contentToAST = (content) => MyParser.parse(content, defaultParserOpts);

/**
 * Retrieve import dependencies from AST
 *
 * @param {Object} ast AST
 * @returns {array} dependencies
 */
const getDependencies = (ast) => {
  const dependencies = [];
  walk.simple(ast, {
    ImportDeclaration: (node) => {
      dependencies.push(node.source.value);
    },
  });

  return dependencies;
};

/**
 * Transform ES6 to ES5
 *
 * @param {Object} ast
 */
const transform = (ast) => {
  return ast;
};

module.exports = {
  contentToAST,
  getDependencies,
  transform,
};
