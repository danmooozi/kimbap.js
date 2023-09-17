
    ((modules) => {
      
    function require(filepath) {
      const { moduleFunc, mappedModule } = modules[filepath];
      const requireFunc = filename => require(mappedModule[filename])
      const module = { exports: {} };
      moduleFunc(requireFunc, module, module.exports);
      return module.exports;
    }
  
      require("C:\\Users\\Administrator\\Desktop\\kimbap.js\\src\\origin\\index.js");
    })({
    "C:\\Users\\Administrator\\Desktop\\kimbap.js\\src\\origin\\index.js": {
      moduleFunc :(require, module, exports) => {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PI = void 0;
var _square = _interopRequireDefault(require("./square.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
console.log("Area of square: ", (0, _square["default"])(3, 5));
var PI = 3.14159265359;
exports.PI = PI;
      },
      mappedModule: {"./square.js":{"filePath":"C:\\Users\\Administrator\\Desktop\\kimbap.js\\src\\origin\\square.js","fileName":"./square.js","content":"const area = (w, h) => w * h;\r\n\r\nexport default area;","ast":{"type":"File","start":0,"end":53,"loc":{"start":{"line":1,"column":0,"index":0},"end":{"line":3,"column":20,"index":53}},"errors":[],"program":{"type":"Program","start":0,"end":53,"loc":{"start":{"line":1,"column":0,"index":0},"end":{"line":3,"column":20,"index":53}},"sourceType":"module","interpreter":null,"body":[{"type":"VariableDeclaration","start":0,"end":29,"loc":{"start":{"line":1,"column":0,"index":0},"end":{"line":1,"column":29,"index":29}},"declarations":[{"type":"VariableDeclarator","start":6,"end":28,"loc":{"start":{"line":1,"column":6,"index":6},"end":{"line":1,"column":28,"index":28}},"id":{"type":"Identifier","start":6,"end":10,"loc":{"start":{"line":1,"column":6,"index":6},"end":{"line":1,"column":10,"index":10},"identifierName":"area"},"name":"area"},"init":{"type":"ArrowFunctionExpression","start":13,"end":28,"loc":{"start":{"line":1,"column":13,"index":13},"end":{"line":1,"column":28,"index":28}},"id":null,"generator":false,"async":false,"params":[{"type":"Identifier","start":14,"end":15,"loc":{"start":{"line":1,"column":14,"index":14},"end":{"line":1,"column":15,"index":15},"identifierName":"w"},"name":"w"},{"type":"Identifier","start":17,"end":18,"loc":{"start":{"line":1,"column":17,"index":17},"end":{"line":1,"column":18,"index":18},"identifierName":"h"},"name":"h"}],"body":{"type":"BinaryExpression","start":23,"end":28,"loc":{"start":{"line":1,"column":23,"index":23},"end":{"line":1,"column":28,"index":28}},"left":{"type":"Identifier","start":23,"end":24,"loc":{"start":{"line":1,"column":23,"index":23},"end":{"line":1,"column":24,"index":24},"identifierName":"w"},"name":"w"},"operator":"*","right":{"type":"Identifier","start":27,"end":28,"loc":{"start":{"line":1,"column":27,"index":27},"end":{"line":1,"column":28,"index":28},"identifierName":"h"},"name":"h"}}}}],"kind":"const"},{"type":"ExportDefaultDeclaration","start":33,"end":53,"loc":{"start":{"line":3,"column":0,"index":33},"end":{"line":3,"column":20,"index":53}},"declaration":{"type":"Identifier","start":48,"end":52,"loc":{"start":{"line":3,"column":15,"index":48},"end":{"line":3,"column":19,"index":52},"identifierName":"area"},"name":"area"}}],"directives":[]},"comments":[]},"mappedModule":{},"dependencyTree":[]}}
    }
  ,
    "C:\\Users\\Administrator\\Desktop\\kimbap.js\\src\\origin\\square.js": {
      moduleFunc :(require, module, exports) => {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var area = function area(w, h) {
  return w * h;
};
var _default = area;
exports["default"] = _default;
      },
      mappedModule: {}
    }
  });
  