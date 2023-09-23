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

/**
 * require function template
 * 
 * @returns {string}
 */
const requireFunctionTemplate = () =>
    `
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
`;

/**
 * bundler runtime template
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
