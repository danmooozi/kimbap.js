import PathUtil from '../util/path.js';
import FileUtil from '../util/file.js';

/**
 * create output directory 
 * @param {string} directoryPath 
 * 
 * @returns {string} directoryPath
 */
const createOutputDirectory = (directoryPath) => {
    const isExist = PathUtil.isDirectory(directoryPath);

    if (!isExist) {
        FileUtil.createDirectory(directoryPath, { recursive: true });
    }

    return directoryPath;
}
/**
 * create bundled output file
 * @param {object} configs 
 * @param {string} outputContent 
 */
export const createOutputFile = (output, outputContent) => {
    const { path, filename } = output;

    const directoryPath = createOutputDirectory(path);
    const filePath = PathUtil.join([directoryPath, filename]);

    FileUtil.createFile(filePath, outputContent);
}