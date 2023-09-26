import fs from 'fs';
import path from 'path';

/**
 * directory 생성 함수 (file util 함수 있으면 거기로 빠져도 될듯)
 * @param {string} directoryPath 
 * 
 * @returns {string} directoryPath
 */
const createDirectory = (directoryPath) => {
    const isExist = fs.existsSync(directoryPath);

    if (!isExist) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    return directoryPath;
}

/**
 * file 생성 함수 (file util 함수 있으면 거기로 빠져도 될듯)
 * @param {string} filePath 
 * @param {string} data 
 */
const createFile = (filePath, data) => {
    fs.writeFileSync(
        filePath,
        data,
        'utf-8'
    );
}

/**
 * 번들링 한 output file 생성 함수
 * @param {object} configs 
 * @param {string} outputContent 
 */
const createOuputFile = (configs, outputContent) => {
    const { output } = configs || {};

    const directoryPath = createDirectory(output.path);
    const filePath = path.join(directoryPath, output.filename);

    createFile(filePath, outputContent);
}

module.exports = {
    createOuputFile
}