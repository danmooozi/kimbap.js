import ModuleCompiler from './parser/index.js';
import CommandLineInterface from './cli/index.js';
import { runtimeTemplate, moduleMapTemplate } from './output/template.js';
import { createOutputFile } from './output/index.js';
import { createSourceMapFile } from './sourcemap/index.js';

class KimbapBundler {
  constructor({ entry, output, ast }) {
    this.entry = entry;
    this.output = output;
  }

  build() {
    const moduleCompiler = new ModuleCompiler(this.entry, this.output.path);
    const { moduleList } = moduleCompiler.run();

    createSourceMapFile({ modules: moduleList, outputPath: this.output.path });

    const entryFilePath = moduleList[0].filePath;
    const outputContent = runtimeTemplate(
      moduleMapTemplate(moduleList),
      entryFilePath,
    );
    
    createOutputFile(this.output, outputContent);
  }
}

const bundlerOptions = CommandLineInterface();
const bundler = new KimbapBundler(bundlerOptions);

bundler.build();