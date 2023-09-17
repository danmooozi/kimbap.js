const fileUtils = require("./file");
const pathUtils = require("./path");

/**
 * @param {*} value - value
 * @param {Function} reviver - transformation function
 * @returns {*} JavaScript value or object
 */
const parse = (value, reviver) => JSON.parse(value, reviver);

/**
 * @param {*} value - value
 * @returns {*} JSON string
 */
const stringify = (value) => JSON.stringify(value);

/**
 * @param {string} filepath file path
 * @param {string} extension extension
 * @returns {string} modulePath with Extension
 */
const getModulePathWithExtension = (filepath, extension = ".js") =>
  filepath.endsWith(extension) ? filepath : `${filepath}${extension}`;

/**
 * @param {string} filepath file path
 * @returns {boolean} isRelativePath
 */
const isRelativePath = (filepath) =>
  filepath.startsWith("./") || filepath.startsWith("../");

/**
 * @param {string} filepath file path
 * @returns {boolean} isAbsolutePath
 */
const isAbsolutePath = (filepath) => filepath.startsWith("/");

module.exports = {
  parse,
  stringify,
  getModulePathWithExtension,
  isRelativePath,
  isAbsolutePath,
  ...fileUtils,
  ...pathUtils,
};
