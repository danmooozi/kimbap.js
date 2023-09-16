const options = require("../kimbap.config");
const { resolver: kimbapResolver } = require("./resolver");
const { contentToAST, getDependencies } = require("./parser");
const { pathToContent } = require("./utils");

const buildModule = (filename, resolver) => {
  const content = pathToContent(filename);
  const ast = contentToAST(content);

  const dependencies = getDependencies(ast)
    .map((relativePath) => resolver(relativePath, filename))
    .map((absolutePath) => buildModule(absolutePath, resolver));

  return {
    filename,
    content,
    dependencies,
  };
};

const createDependencyGraph = (entryFile, resolver) =>
  buildModule(entryFile, resolver);

const build = (opts) => {
  const { entry, output } = opts || {};
  const ROOT_PATH = `${process.cwd()}/`;

  // resolving
  const resolver = kimbapResolver(ROOT_PATH);

  // build dependency graph
  const graph = createDependencyGraph(entry, resolver);

  console.log(graph);
};

build(options);
