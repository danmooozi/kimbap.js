const options = require("../kimbap.config");
const { resolver: kimbapResolver } = require("./resolver");
const { contentToAST, getDependencies, transform } = require("./parser");
const { mainTemplate, moduleMapTemplate } = require("./template");
const { joinPaths, pathToContent, writeFile } = require("./utils");

const ROOT_PATH = `${process.cwd()}/`;
const resolver = kimbapResolver(ROOT_PATH);

const buildModule = (filename, filepath) => {
  const content = pathToContent(filepath);
  const ast = contentToAST(content);
  const mapping = {};

  const dependencies = getDependencies(ast)
    .map((relativePath) => ({
      relativePath,
      absolutePath: resolver(relativePath, filename),
    }))
    .map(({ relativePath, absolutePath }) => {
      const dependencyObject = buildModule(relativePath, absolutePath);
      mapping[relativePath] = dependencyObject.filepath;

      return dependencyObject;
    });

  return {
    filename,
    filepath,
    content,
    dependencies,
    transformedCode: transform(ast),
    mapping,
  };
};

const createDependencyGraph = (entry) => buildModule(entry, entry);

const getModulesFromGraph = (graph) => {
  const modules = new Set();

  function extractDependencies(module) {
    if (modules.has(module)) return;

    modules.add(module);
    (module?.dependencies || []).forEach(extractDependencies);
  }

  extractDependencies(graph);
  return Array.from(modules);
};

const bundle = (graph) => {
  const modules = getModulesFromGraph(graph);
  const entryFile = modules[0].filename;
  const bundledCode = mainTemplate(moduleMapTemplate(modules), entryFile);

  return bundledCode;
};

const build = (opts) => {
  const { entry, output } = opts || {};

  // build dependency graph
  const graph = createDependencyGraph(entry);

  // bundle module
  const outputContent = bundle(graph);

  // write file
  writeFile(joinPaths(output.path, output.filename), outputContent);
};

build(options);
