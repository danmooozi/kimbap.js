import ModuleCompiler from './parser/index.js';
import CommandLineInterface from './cli/index.js';

class KimbapBundler {
  constructor({ entry, output, ast }) {
    this.entry = entry;
    this.output = output;
  }

  // FIXME : 모듈이 정상적으로 컴파일 되는지 테스트 하기 위한 용도
  build() {
    const moduleCompiler = new ModuleCompiler(this.entry);
    moduleCompiler.run(ast);
  }
}

const bundlerOptions = CommandLineInterface();
const bundler = new KimbapBundler(bundlerOptions);
bundler.build();
