import ModuleCompiler from './parser/index.js';
import CommandLineInterface from './cli/index.js';

class KimbapBundler {
  constructor({ entry, output, ast }) {
    this.entry = entry;
    this.output = output;
  }

  build() {
    const moduleCompiler = new ModuleCompiler(this.entry);
    const { moduleList } = moduleCompiler.run(ast);
     
    const entryFilePath = moduleList[0].filePath;
    const outputContent = runtimeTemplate(
      moduleMapTemplate(moduleList),
      entryFilePath,
    );
    
    createOutputFile({ output }, outputContent);
  }
}

const bundlerOptions = CommandLineInterface();
const bundler = new KimbapBundler(bundlerOptions);

bundler.build();