import { mkdirSync, writeFileSync } from 'fs';

class FileUtil {
    /**
     * create directory
     * @param {string} path 
     * @param {object} options 
     */
    static createDirectory(path, options) {
        mkdirSync(path, options);
    }

    /**
     * create file
     * @param {string} path 
     * @param {string} data 
     */
    static createFile(path, data) {
        writeFileSync(
            path, 
            data, 
            'utf-8'
        ); 
    }
}

export default FileUtil;