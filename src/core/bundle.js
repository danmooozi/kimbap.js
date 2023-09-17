import { collectModules, createModuleMap } from "./dependency.js";
import { trim } from "../utils/string.js";

/**
 * dependency 그래프를 바탕으로 module map 을 만들고 module map 을 실행할 수 있는 runtime 생성
 * @param {object} graph 
 * 
 * @returns {[{ name: string, content: string}]}
 */
export function bundle(graph) {
    const modules = collectModules(graph); 
    const moduleMap = createModuleMap(modules);
    const moduleCode = createRuntime(moduleMap, modules[0].filePath);

    return [{ name: 'kimbap.js', content: moduleCode }];
}

/**
 * runtime 생성
 * @param {string} moduleMap 
 * @param {string} entryPoint 
 * 
 * @returns {string}
 */
export function createRuntime(moduleMap, entryPoint) {
    return trim(`
        const modules = ${moduleMap};
        const entry = "${entryPoint}";

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
    `);
}