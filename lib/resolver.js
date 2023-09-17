const {
  getModulePathWithExtension,
  isRelativePath,
  isAbsolutePath,
  parse,
  joinPaths,
  getDirname,
  isDir,
  isFile,
  pathToContent,
} = require("./utils");

const DEFAULT_FILE = "index.js";

/**
 * @param {string} nodeModulePath node_modules path
 * @returns {string} packageJson main path
 */
const getMainFromPackageJson = (nodeModulePath) => {
  const packageJsonPath = joinPaths(nodeModulePath, "package.json");
  const packageJsonContent = pathToContent(packageJsonPath);
  const packageJson = parse(packageJsonContent);
  return packageJson.main || DEFAULT_FILE;
};

/**
 * @param {string} nodeModulePath node_modules path
 * @returns {string} node_modules full path
 */
const getNodeModuleFullPath = (nodeModulePath) => {
  const modulePathWithExtension = getModulePathWithExtension(
    nodeModulePath,
    ".js"
  );

  if (isDir(nodeModulePath)) {
    const main = getMainFromPackageJson(nodeModulePath);
    return joinPaths(nodeModulePath, main);
  }

  if (isFile(modulePathWithExtension)) {
    return modulePathWithExtension;
  }

  return modulePathWithExtension;
};

/**
 * @param {string} rootPath - The root path from which module paths are resolved.
 * @returns {function(modulePath: string, currentPath: string): string} A resolver function
 *   that takes a module path and a current path and returns the resolved full path.
 */
const resolver = (rootPath) => (modulePath, currentPath) => {
  const modulePathWithExtension = getModulePathWithExtension(modulePath, ".js");

  if (isRelativePath(modulePath))
    return joinPaths(getDirname(currentPath), modulePathWithExtension);

  if (isAbsolutePath(modulePath)) return modulePathWithExtension;

  const nodeModulePath = `${rootPath}node_modules/${modulePath}`;
  return getNodeModuleFullPath(nodeModulePath);
};

module.exports = {
  resolver,
};
