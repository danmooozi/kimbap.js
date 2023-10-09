import PathUtil from '../util/path';
import FileUtil from '../util/file';

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
const createOutputFile = (configs, outputContent) => {
    const { output } = configs || {};

    const directoryPath = createOutputDirectory(output.path);
    const filePath = PathUtil.join([directoryPath, output.filename]);

    FileUtil.createFile(filePath, outputContent);
}

module.exports = {
    createOutputFile
}