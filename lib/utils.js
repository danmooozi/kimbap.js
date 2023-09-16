const fs = require("fs");
const path = require("path");

/**
 * @param {*} value - value
 * @param {Function} reviver - transformation function
 * @returns {*} parsed value
 */
const parse = (value, reviver) => JSON.parse(value, reviver);

/**
 * @param {...string} paths - The path segments to join.
 * @returns {string} joined path.
 */
const joinPaths = (...paths) => path.join(...paths);

/**
 * @param {string} filePath file path
 * @param {string} extension extension
 * @returns {string} modulePath with Extension
 */
const getModulePathWithExtension = (filePath, extension = ".js") =>
  filePath.endsWith(extension) ? filePath : `${filePath}${extension}`;

/**
 * @param {string} filePath file path
 * @returns {boolean} isRelativePath
 */
const isRelativePath = (filePath) =>
  filePath.startsWith("./") || filePath.startsWith("../");

/**
 * @param {string} filePath file path
 * @returns {boolean} isAbsolutePath
 */
const isAbsolutePath = (filePath) => filePath.startsWith("/");

/**
 * @param {string} filePath file path
 * @returns {boolean} isDir
 */
const isDir = (filePath) => {
  try {
    const stat = fs.lstatSync(filePath);
    return stat.isDirectory();
  } catch (e) {
    // throws an error if path doesn't exist
    return false;
  }
};

/**
 * @param {string} filePath file path
 * @returns {boolean} isFile
 */
const isFile = (filePath) => {
  try {
    const stat = fs.lstatSync(filePath);
    return stat.isFile();
  } catch (e) {
    // throws an error if path doesn't exist
    return false;
  }
};

/**
 * return content of the file from file path
 *
 * @param {string} filePath filePath
 * @returns {string} content
 */
const pathToContent = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "UTF-8");
    return content;
  } catch (e) {
    return "";
  }
};

module.exports = {
  parse,
  joinPaths,
  getModulePathWithExtension,
  isRelativePath,
  isAbsolutePath,
  isDir,
  isFile,
  pathToContent,
};
