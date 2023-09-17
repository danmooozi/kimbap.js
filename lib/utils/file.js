const {
  lstatSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} = require("fs");
const { getDirname } = require("./path");

/**
 * @param {string} filepath file path
 * @returns {boolean} isDir
 */
const isDir = (filepath) => {
  try {
    const stat = lstatSync(filepath);
    return stat.isDirectory();
  } catch (e) {
    // throws an error if path doesn't exist
    return false;
  }
};

/**
 * @param {string} filepath file path
 * @returns {boolean} isFile
 */
const isFile = (filepath) => {
  try {
    const stat = lstatSync(filepath);
    return stat.isFile();
  } catch (e) {
    // throws an error if path doesn't exist
    return false;
  }
};

/**
 * return content of the file from file path
 *
 * @param {string} filepath file path
 * @returns {string} content
 */
const pathToContent = (filepath) => {
  try {
    const content = readFileSync(filepath, "UTF-8");
    return content;
  } catch (e) {
    return "";
  }
};

/**
 * creates a new file
 *
 * @param {string} filepath file path
 * @param {*} data data
 * @returns {void} nothing
 */
const writeFile = (filepath, data) => {
  try {
    const dir = getDirname(filepath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filepath, data, "UTF-8");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  isDir,
  isFile,
  pathToContent,
  writeFile,
};
