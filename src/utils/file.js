import path from 'path';
import fs from 'fs';

/**
 * 실제 경로 확인 - resolving
 * @param {string} requester 
 * @param {string} requestedPath 
 * 
 * @returns {string}
 */
export function resolveRequest(requester, requestedPath) {
    if (requestedPath[0] === '.') {
        // 상대경로
        return path.join(path.dirname(requester), requestedPath);
    } else {
        // 절대경로
        const requesterParts = requester.split('/');
        const requestPaths = [];

        for (let i = requesterParts.length - 1; i > 0; i--) {
            requestPaths.push(requesterParts.slice(0, i).join('/') + '/node_modules');
        }

        return require.resolve(requestedPath, { path: requestPaths });
    }
}

/**
 * directory 생성 함수 
 * @param {string} directoryPath 
 * 
 * @returns {string} directoryPath
 */
export function makeDirectory(directoryPath) {
    const isExists = fs.existsSync(directoryPath);
    if (!isExists) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    return directoryPath;
}