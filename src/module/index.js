import Parser from '../parser/index.js';
import PathUtil from '../util/path.js';
import { parseSync } from '@babel/core';

class ModuleBuilder {
  constructor(fileName, filePath) {
    this.filePath = filePath;
    this.fileName = fileName;
    this.content = PathUtil.getContentInPath(filePath);
    this.ast = parseSync(this.content);

    // 해당 모듈과 의존성 관계에 놓인 모듈의 목록 mappedModule
    this.mappedModule = {};

    // 해당 모듈의 의존성 관계 정보를 배열로 담은 dependencyList
    this.dependencyTree = this.createDependencyTree();
  }

  getTemplate() {
    return `
    ${JSON.stringify(this.filePath)}: {
      moduleFunc :(require, module, exports) => {
        ${Parser.transformCodeFromAST(this.ast)}
      },
      mappedModule: ${JSON.stringify(this.mappedModule)}
    }
  `;
  }

  // 해당 모듈과 의존성 관계에 놓인 모듈을 가져오고 Tree로 병합하는 createDependencyTree
  createDependencyTree() {
    // 1. AST 노드를 순회하며 ImportDeclaration (import) type인 Node를 찾고 경로를 추출한다.
    // 2. 해당 경로를 기반으로 의존성 관계에 놓인 모듈을 Mapping 하여 보관한다.
    const dependencies = Parser.getDependencyPaths(this.ast).map(
      (relativePath) => {
        const absolutePath = Parser.resolveModulePath(
          relativePath,
          this.fileName,
        );
        const dependencyModule = new ModuleBuilder(relativePath, absolutePath);
        this.mappedModule[relativePath] = dependencyModule;
        return dependencyModule;
      },
    );

    return dependencies;
  }
}

export default ModuleBuilder;
