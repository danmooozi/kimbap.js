const modules = {"/Users/jobchae/Desktop/jobchae/goorm/kimbap.js/example/index.js": function(exports, require) { const _imported = require("/Users/jobchae/Desktop/jobchae/goorm/kimbap.js/example/square.js");
const _imported2 = require("/Users/jobchae/Desktop/jobchae/goorm/kimbap.js/example/circle.js");
exports.PI = 3.141;
console.log('Area of square: ', _imported["default"](5));
console.log('Area of circle', _imported2["default"](5));
 },"/Users/jobchae/Desktop/jobchae/goorm/kimbap.js/example/square.js": function(exports, require) { function area(side) {
  return side * side;
}
exports.default = area;
 },"/Users/jobchae/Desktop/jobchae/goorm/kimbap.js/example/circle.js": function(exports, require) { const _imported = require("/Users/jobchae/Desktop/jobchae/goorm/kimbap.js/example/index.js");
function area(radius) {
  return _imported["PI"] * radius * radius;
}
exports.default = area;
 },};
const entry = "/Users/jobchae/Desktop/jobchae/goorm/kimbap.js/example/index.js";
function kimbapStart({ modules, entry }) {
    const moduleCache = {};
    const require = moduleName => {
        if (moduleCache[moduleName]) {
            return moduleCache[moduleName];
        }
        const exports = {};
        moduleCache[moduleName] = exports;
        
        modules[moduleName](exports, require);
        return moduleCache[moduleName];
    };
    require(entry);
}
kimbapStart({ modules, entry });
    