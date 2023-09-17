const { stringify } = require("./utils");

const requireFunction = () =>
  `
    function require(filepath) {
      const { fn, map } = modules[filepath];
      const requireFn = filename => require(map[filename])
      const module = { exports: {}};

      fn(requireFn, module, module.exports);

      return module.exports;
    }
  `;

const moduleTemplate = ({ filepath, transformedCode, mapping }) =>
  `
    ${stringify(filepath)}: {
      fn :(require, module, exports) => {
        ${transformedCode}
      },
      map: ${stringify(mapping)}
    }
  `;

const moduleMapTemplate = (modules) =>
  `{${modules.map((module) => moduleTemplate(module)).join(",")}}`;

const mainTemplate = (moduleMap, entry) =>
  `
    ((modules) => {
      ${requireFunction()}

      require(${stringify(entry)});
    })(${moduleMap});
  `;

module.exports = {
  mainTemplate,
  moduleMapTemplate,
};
