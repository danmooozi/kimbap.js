import { CodeGenerator } from '@babel/generator';
import { createOutputFile } from '../output/index.js';
import PathUtil from '../util/path.js';

/**
 * generate sourcemap
 * @param {object} params
 * @param {object} params.ast
 * @param {string} params.fileContent
 * @param {string} params.filePath
 * @param {string} params.entryPath
 * @param {string} params.outputPath
 * 
 * @returns {object}
 */
export const createSourceMap = ({
    ast,
    fileContent,
    filePath,
    entryPath,
    outputPath
}) => {
    const sourceFileName = PathUtil.relative(outputPath, filePath);

    const generator = new CodeGenerator(ast, { sourceMaps: true, sourceFileName, sourceRoot: entryPath }, fileContent);
    const { map } = generator.generate(ast, {}, fileContent);

    return map;
}

/**
 * sourcemap 파일 작성
 * @param {object} params
 * @param {object[]} params.modules
 * @param {string} params.outputPath
 */
export const createSourceMapFile = ({ modules, outputPath }) => {
    modules.map(module => {
        const { sourceMapContent, filePath } = module;

        const parsedPaths = filePath.split('/');
        const filename = parsedPaths[parsedPaths.length - 1];

        createOutputFile({ path: outputPath, filename: `${filename}.map` }, JSON.stringify(sourceMapContent));
    });
}