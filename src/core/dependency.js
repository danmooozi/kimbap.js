import { Module } from './module.js';

const MODULE_CACHE = new Map();

/**
 * 해당 파일에 대한 Module 인스턴스가 캐시되어 있다면 반환, 없다면 새로 생성
 * !! CACHE 사용하지 않을 시 circular dependency 가 있을 경우 infinite loop 로 call stack size 에러 남 !!
 * @param {string} filePath 
 * 
 * @returns {object} MODULE_CACHE[filePath]
 */
export function createModule(filePath) {
    if (!MODULE_CACHE.has(filePath)) {
        const module = new Module(filePath);

        MODULE_CACHE.set(filePath, module);
        module.initDependencies();
    }

    return MODULE_CACHE.get(filePath);
}

/**
 * Module Map 생성
 * @param {object[]} modules 
 * 
 * @returns {string} moduleMap
 */
export function createModuleMap(modules) {
    let moduleMap = '{';
    
    for (const module of modules) {
        moduleMap += `"${module.filePath}": `;
        module.transformModuleInterface();
        moduleMap += `function(exports, require) { ${module.content}\n },`;  // module factory 함수
    }

    moduleMap += '}';

    return moduleMap;
}

/**
 * dependency graph 의 모든 모듈을 재귀적으로 수집
 * @param {object} graph 
 * @returns {object[]} modules
 */
export function collectModules(graph) {
    const modules = new Set();

    collect(graph, modules);

    return Array.from(modules);

    function collect(module, modules) {
        if (!modules.has(module)) {
            modules.add(module);
            module.dependencies.forEach(dependency => collect(dependency, modules));
        }
    }
}

/**
 * entryFile 부터 dependency 그래프 생성
 * @param {string} entryFile 
 * 
 * @returns {object} rootModule
 */
export function createDependencyGraph(entryFile) {
    const rootModule = createModule(entryFile);

    return rootModule;
}
