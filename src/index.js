import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import Parser from './parser/index.js';
import ModuleBuilder from './module/index.js';
import TemplateUtil from './util/template.js';
import PathUtil from './util/path.js';

class KimbapBundler {
  constructor({ entry, output }) {
    this.entry = entry;
    this.output = output;
  }

  // 모듈 목록을 기반으로 하나의 번들링된 파일을 생성하는 함수 bundle
  bundle(dependencyTree) {
    const modules = Parser.getModulesFromTree(dependencyTree);
    const entryFile = modules[0].fileName;

    const moduleMap = TemplateUtil.moduleMapTemplate(modules);
    const bundledCode = TemplateUtil.mainTemplate(moduleMap, entryFile);
    return bundledCode;
  }

  build() {
    const dependencyTree = new ModuleBuilder(this.entry, this.entry);
    const outputContent = this.bundle(dependencyTree);
    const outputDirectory = dirname(join(this.output.path, this.output.fileName));

    console.log(outputDirectory);

    PathUtil.writeFile(outputDirectory, outputContent);
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const bundlerOptions = {
    entry: join(__dirname, "./origin/index.js"),
    output: {
        path: join(__dirname, "./dist"),
        fileName: "main.js",
    }
}

const bundler = new KimbapBundler(bundlerOptions);
bundler.build();