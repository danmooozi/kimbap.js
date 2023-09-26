/**
 * 문자열 trim 함수 (util 함수로 빼도 될듯)
 * @param {string} target 
 * 
 * @returns {string}
 */
const trim = (target) => {
    const lines = target.split('\n').filter(Boolean);
    const padLength = lines[0].length - lines[0].trimLeft().length;
    const regex = new RegExp(`^\\s{${padLength}}`);

    return lines.map(line => line.replace(regex, '')).join('\n');
}

// const requireFunctionTemplate = () =>
//     `
//     const moduleCache = {};
//     const require = moduleName => {
//         if (moduleCache[moduleName]) {
//             return moduleCache[moduleName];
//         }
//         const exports = {};
//         moduleCache[moduleName] = exports;

//         modules[moduleName](exports, require);
//         return moduleCache[moduleName];
//     };
// `;

/**
 * require function template (exports shortcut)
 *
 * @returns {string}
 */
const requireFunctionTemplate = () => 
`
    const require = moduleName => {
        const { fn, map } = modules[moduleName];
        const localRequire = path => require(map[path])
        
        const module = { exports: {} };
        fn(localRequire, module, module.exports);
        return module.exports;
    }
`;

/**
 * template for transfiled function and dependency map
 * @param {object} module
 * @param {string} module.filepath 
 * @param {string} module.transformedContent
 * @param {object} module.mapping
 * 
 * @returns {string}
 */
const moduleTemplate = ({ filePath, transformedContent, mapping }) => 
`
    ${JSON.stringify(filePath)}: {
        fn: (require, module, exports) => {
            ${transformedContent}
        },
        map: ${JSON.stringify(mapping)}
    }
`;

/**
 * template for module map
 * @param {object[]} modules 
 * 
 * @returns {array}
 */
const moduleMapTemplate = (modules) => `{${modules.map(module => moduleTemplate(module)).join(',')}}`;

/**
 * bundler runtime template 
 * runtimeTemplate(modules: moduleMapTemplate(moduleGraph), entry)
 * @param {object} modules 
 * @param {string} entry 
 * 
 * @returns {string}
 */
const runtimeTemplate = (modules, entry) => {
    return trim(`
        function kimbapStart({ modules, entry }) { 
            ${requireFunctionTemplate()}

            require(${entry});
        }

        kimbapStart({ ${modules}, ${entry} });
    `);
}

module.exports = {
    runtimeTemplate,
}