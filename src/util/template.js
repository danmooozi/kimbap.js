import Parser from '../parser/index.js';

class TemplateUtil {
  static requireFunc() {
    return `
    function require(filepath) {
      const { moduleFunc, mappedModule } = modules[filepath];
      const requireFunc = filename => require(mappedModule[filename])
      const module = { exports: {}};
      moduleFunc(requireFunc, module, module.exports);
      return module.exports;
    }
  `;
  }

  static moduleMapTemplate(moduleList) {
    return `{${moduleList.map((module) => module.getTemplate()).join(',')}}`;
  }

  static mainTemplate(moduleMap, entry) {
    return `
    ((modules) => {
      ${this.requireFunc()}
      require(${JSON.stringify(entry)});
    })(${moduleMap});
  `;
  }
}

export default TemplateUtil;
