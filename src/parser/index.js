import { dirname, resolve } from 'path';
import { parseSync } from '@babel/core';
import transform from '../transform/index.js'
import { createSourceMap } from '../sourcemap/index.js';
import Queue from '../util/queue.js';
import PathUtil from '../util/path.js';

class ModuleCompiler {
  constructor(entry, output) {
    this.entry = entry;
    this.output = output;
    // 컴파일이 완료된 모듈을 담은 Array compiledModules
    this.compiledModules = [];
  }

  // 탐색한 모듈의 경로를 보관한 Set findModuleSet
  #findModuleList = new Set();
  // 컴파일 예정인 모듈 목록을 담은 Queue compiledQueue
  #compiledQueue = new Queue();

  run() {
    const entryPath = this.#getLocalModulePath(this.entry);

    // Entry 파일의 path 를 컴파일 대상으로 추가한다.
    this.#compiledQueue.enqueue(entryPath);
    this.#findModuleList.add(entryPath);

    // 의존성 관계를 가진 모든 하위 모듈들에 대한 재귀 탐색 진행.
    while (this.#compiledQueue.size()) {
      let currentModulePath = this.#compiledQueue.dequeue();
      const compiledModule = this.#compileModule(currentModulePath);
      this.compiledModules.push(compiledModule);
    }

    return {
      moduleCache: this.#findModuleList,
      moduleList: this.compiledModules,
    };
  }

  #compileModule(filePath) {
    let fileContent = PathUtil.getContentInPath(filePath, 'utf-8');
    const ast = parseSync(fileContent);

    // 현재 컴파일을 진행 중인 모듈과 의존성 관계를 맺은 모듈 경로 목록.
    const mapping = {};

    // 해당 Module의 AST를 순회하여 ImportDeclaration 타입의 노드를 찾는다.
    ast.program.body
      .filter((node) => node.type === 'ImportDeclaration')
      .map(({ source }) => {
        const importPath = source.value;

        // 앞이 '.' 으로 시작하는지 아닌지에 따라 경로 탐색 로직을 이원화.
        const modulePath = importPath.startsWith('.')
          ? this.#getLocalModulePath(importPath, filePath)
          : this.#getNpmModulePath(importPath, filePath);

        // 새로 찾은 모듈이라면 목록에 추가하고, 다음 컴파일할 목록에 추가한다.
        if (!this.#findModuleList.has(modulePath)) {
          this.#findModuleList.add(modulePath);
          this.#compiledQueue.enqueue(modulePath);
        }

        mapping[importPath] = modulePath;
      });


    const sourceMapContent = createSourceMap({ ast, fileContent, filePath, entryPath: this.entry, outputPath: this.output });
    // 현재 모듈의 코드를 transform 하여 변환된 결과를 보관
    const { transformedContent } = transform(ast, fileContent);

    return { filePath, mapping, transformedContent, sourceMapContent };
  }

  #getLocalModulePath(path, root) {
    let absolutePath = root ? resolve(dirname(root), path) : resolve(path);

    // 1. 해당 절대 경로에 파일이 존재한다면 모듈이므로, 즉시 return
    if (PathUtil.isFile(absolutePath)) {
      return absolutePath;
    }

    // 2. 디렉토리 내 index.js 가 존재한다면 해당 경로를 return 시킨다.
    let indexPath = resolve(absolutePath, 'index.js');

    if (PathUtil.isDirectory(absolutePath) && PathUtil.isFile(indexPath)) {
      return indexPath;
    }

    throw new Error('해당 모듈의 경로를 찾을 수 없습니다.');
  }

  #getNpmModulePath(modulePath, root) {
    let rootPath = dirname(root);

    // 해당 루트 경로를 기준으로 node_modules 디렉토리가 있는지 검사.
    const checkIsNodeModule = (rootPath) => {
      const resolvedPath = resolve(rootPath, 'node_modules');
      return PathUtil.isDirectory(resolvedPath);
    };

    // 재귀적으로 루트 폴더 하위에 node_modules 이 있는지를 모두 검사.
    while (!checkIsNodeModule(rootPath)) {
      rootPath = dirname(rootPath);
    }

    // node_modules 탐색 종료 후, 해당 위치를 기반으로 package의 경로를 추출
    let packagePath = resolve(rootPath, 'node_modules', modulePath);

    // 1. 해당 Path 가 파일을 경우, 즉시 해당 경로를 return
    let packageFilePath = packagePath + '.js';
    if (PathUtil.isFile(packageFilePath)) {
      return packageFilePath;
    }

    // 2. 해당 path 의 디렉토리 내에 위치한 package.json을 읽고 main Entry를 추출.
    let packageJsonPath = resolve(packagePath, 'package.json');
    if (PathUtil.isFile(packageJsonPath)) {
      let jsonContent = JSON.parse(PathUtil.getContentInPath(packageJsonPath));

      // packaage.json 에 명시된 module 혹은 main의 경로를 추출한다.
      let mainPath = jsonContent.module || jsonContent.main || undefined;

      if (mainPath) {
        return resolve(packagePath, mainPath);
      }
    }

    // 3. 해당 path 의 디렉토리 내에 존재하는 index.js 가 있는지 체크한다.
    const indexPath = resolve(packagePath, 'index.js');
    if (PathUtil.isFile(indexPath)) {
      return indexPath;
    }

    // 4. 위 세 가지 케이스에 걸리지 않으면 모듈이 없다는 의미이므로 에러를 throw
    throw new Error(`해당 경로에 위치한 모듈을 찾을 수 없습니다.`);
  }
}

export default ModuleCompiler;
