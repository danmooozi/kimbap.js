import StringUtil from "../util/string";

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
    return StringUtil.trim(`
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