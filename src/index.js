import ModuleCompiler from './parser/index.js';
import { runtimeTemplate, moduleMapTemplate } from './output/template.js';
import { createOutputFile } from './output/index.js';

class KimbapBundler {
  constructor({ entry, output, ast }) {
    this.entry = entry;
    this.output = output;
  }

  build() {
    const moduleCompiler = new ModuleCompiler(this.entry);
    const { moduleList } = moduleCompiler.run();

    const entryFilePath = moduleList[0].filePath;
    const outputContent = runtimeTemplate(
      moduleMapTemplate(moduleList),
      entryFilePath,
    );

    createOutputFile(this.output, outputContent);
  }
}

export default KimbapBundler;
