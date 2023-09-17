import { join, dirname } from 'path';
import { transformFromAstSync } from '@babel/core';

import PathUtil from "../util/path.js";


class Parser {
    // 의존성 트리를 기반으로 모듈을 추출하여 배열로 반환하는 함수 getModulesFromGraph
    static getModulesFromTree(graph) {
        const moduleCache = new Set();

        function collectDependencies(module) {
        if (moduleCache.has(module)) return;

        // 새로운 모듈을 캐싱하고, 해당 모듈과 의존성 관계에 놓인 모듈에 대해서 재귀 탐색
        moduleCache.add(module);
        (module?.dependencyTree || []).forEach(collectDependencies);
        }

        collectDependencies(graph);
        return Array.from(moduleCache);
    }

    // AST 노드를 코드로 재반환 시켜주는 함수 transformCodeFromAST
    static transformCodeFromAST(ast) {
        const { code } = transformFromAstSync(ast, null, null);
        return code;
    };

    // ImportDeclaration (import) type인 Node를 찾고 경로를 추출하는 함수 getDependencyPaths
    static getDependencyPaths(ast) {
        return ast.program.body
        .filter((node) => node.type === 'ImportDeclaration')
        .map(({ source }) => source.value)
    }

    // 상대 경로와 파일명을 기반으로 모듈의 실제 경로를 찾아내는 함수 resolveModulePath
    static resolveModulePath(path, fileName) {
    
        const pathWithExtension = PathUtil.getModulePathWithExtension(path, ".js");

        // 1. 상대 경로라면 해당 파일의 경로를 완전히 붙여 반환한다.
        if (PathUtil.isRelativePath(pathWithExtension)) {
            return join(dirname(fileName), pathWithExtension);
        }

        // 2. 절대 경로라면 경로 그대로를 반환한다 (절대 경로가 목적이므로)
        if (PathUtil.isAbsolutePath(pathWithExtension)) {
            return pathWithExtension;
        }

        // 3. 절대 경로도 상대 경로도 아니라면 node_modules 내에 있다.
        const nodeModulePath = `${process.cwd()}/node_modules/${path}`;
        const nodeModulePathWithExtension = PathUtil.getModulePathWithExtension(nodeModulePath);

        // 3-1. 해당 경로가 node_module 내 디렉토리라면 해당 패키지의 정보를 담은 package.json 을 가져온다.
        // package.json 내부에 main 속성이 있으면 해당 내용을, 그렇지 않으면 index.js 를 가져온다 (기본 Entry)
        if (PathUtil.isDirectory(nodeModulePath)) {
            const packagePath = join(nodeModulePath, "package.json");
            const packageContent = JSON.parse(PathUtil.getContentInPath(packagePath));
            return packageContent.main || 'index.js'
        }

        // 3-2. 해당 경로가 node_module 내 파일을 지칭한다면 해당 경로를 반환한다.
        if (PathUtil.isFile(nodeModulePathWithExtension)) {
            return nodeModulePathWithExtension;
        }

        // 3-3. 모든 케이스에 포함되지 않았다면 error 를 throw 한다. (Resource 를 찾을 수 없음)
        throw new Error('해당 경로에 위치한 Module을 찾을 수 없습니다.')

    }  
}

export default Parser;