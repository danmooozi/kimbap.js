const { join, dirname } = require("path");

/**
 * @param {...string} paths - The path segments to join.
 * @returns {string} joined path.
 */
const joinPaths = (...paths) => join(...paths);

/**
 * @param {string} filepath file path
 * @returns {string} the directories from a file path
 */
const getDirname = (filepath) => dirname(filepath);

module.exports = {
  joinPaths,
  getDirname,
};
