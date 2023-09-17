const fs = require("fs");
const esprima = require("esprima");
const path = require("path");

function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];

  console.log(queue);

  for (const asset of queue) {
    const dirname = path.dirname(asset.fileName);
    asset.mapping = {};

    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);
      const childAsset = createAsset(absolutePath);

      asset.mapping[relativePath] = childAsset.fileName;
      queue.push(childAsset);
    });
  }

  return queue;
}

function createAsset(fileName) {
  const contents = fs.readFileSync(fileName, "utf-8");
  const ast = esprima.parseScript(contents);

  const dependencies = [];
  traverse(ast, {
    enter(node) {
      if (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "require"
      ) {
        dependencies.push(node.arguments[0].value);
      }
    },
  });

  return { fileName, dependencies, code: contents };
}

function traverse(node, { enter }) {
  enter(node);
  for (const key in node) {
    if (node[key] && typeof node[key] === "object") {
      traverse(node[key], { enter });
    }
  }
}

function bundle(graph) {
  let modules = "";

  graph.forEach((mod) => {
    modules += `'${mod.fileName}': [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
  
        function localRequire(relativePath) {
          return require(mapping[relativePath]);
        }
  
        const module = { exports: {} };
  
        fn(localRequire, module, module.exports);
  
        return module.exports;
      }
  
      require('${graph[0].fileName}');
    })({${modules}})
  `;

  return result;
}

const graph = createGraph("./2step/index.js");
const result = bundle(graph);
// dist 폴더가 없으면 생성
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}
fs.writeFileSync("./dist/bundle.js", result);
