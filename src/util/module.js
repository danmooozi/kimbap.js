import { existsSync, lstatSync, readFileSync } from 'fs';

class ModuleUtil {

    // 해당 경로가 디렉토리인지를 판별하는 함수 isDirectory
    static isDirectory(path) {
        return existsSync(path) && lstatSync(path).isDirectory()
    }

    // 해당 경로가 파일인지를 판별하는 함수 isFile
    static isFile(path) {
        return existsSync(path) && lstatSync(path).isFile()
    }

    // 해당 경로가 상대 경로인지 (./, ../) 를 판별하는 함수 isRelativePath
    static isRelativePath(path) {
        return path.startsWith("./") || path.startsWith("../")
    }

    // 해당 경로가 절대 경로인지 (./, ../) 를 판별하는 함수 isRelativePath
    static isAbsolutePath(path) {
        return path.startsWith("/");
    }

    // 특정 경로에 위치한 파일의 Content 를 가져오는 함수 getContentInPath
    static getContentInPath(path) {
        return readFileSync(path, 'UTF-8');
    }

    // 파일의 경로와 확장자를 합친 결과를 반환하는 함수 getModulePathWithExtension
    // 파일의 확장자까지 합쳐진 최종 경로를 요구하는 케이스가 있어 제작되었음.
    static getModulePathWithExtension(path, extension = ".js") {
        return path.endsWith(extension) ? path : `${path}${extension}`
    }
}

export default ModuleUtil;