import {
  existsSync,
  lstatSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
} from 'fs';

/**
 * Node.js 에서 require() 모듈을 찾기 위해 진행하는 알고리즘을 구현하기 위한 Util
 * 추가로 특정 경로에 위치한 파일의 정보를 가져오는 로직도 이 Util 내부에 구현하였습니다.
 *
 * [해당 Module의 절대 경로를 파악하는 순서]
 * 1. source.value 의 유형이 절대 경로인가?
 * 2. source.value 의 유형이 상대 경로인가?
 * 3. node_module 내 어디에 위치해 있는가? (파일인가 / 디렉토리인가 / node_module 내부인가)
 *
 * https://nodejs.org/api/modules.html#modules_all_together
 */

class PathUtil {
  // 루트 경로 rootPath
  #rootPath = `${process.cwd()}/`;

  // 해당 경로가 디렉토리인지를 판별하는 함수 isDirectory
  static isDirectory(path) {
    return existsSync(path) && lstatSync(path).isDirectory();
  }

  // 해당 경로가 파일인지를 판별하는 함수 isFile
  static isFile(path) {
    return existsSync(path) && lstatSync(path).isFile();
  }

  // 해당 경로가 상대 경로인지 (./, ../) 를 판별하는 함수 isRelativePath
  static isRelativePath(path) {
    return path.startsWith('./') || path.startsWith('../');
  }

  // 해당 경로가 절대 경로인지 (./, ../) 를 판별하는 함수 isRelativePath
  static isAbsolutePath(path) {
    return path.startsWith('/');
  }

  // 특정 경로에 위치한 파일의 Content 를 가져오는 함수 getContentInPath
  static getContentInPath(path) {
    return readFileSync(path, 'UTF-8');
  }

  // 파일의 경로와 확장자를 합친 결과를 반환하는 함수 getModulePathWithExtension
  // 파일의 확장자까지 합쳐진 최종 경로를 요구하는 케이스가 있어 제작되었음.
  static getModulePathWithExtension(path, extension = '.js') {
    return path.endsWith(extension) ? path : `${path}${extension}`;
  }

  // 특정 경로에 파일을 추가해주는 함수 writeFile
  static writeFile(path, content) {
    try {
      // output path에 디렉토리가 없을 경우 새롭게 만들어준다.
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }

      // output 디렉토리에 Bundling 된 파일을 추가한다.
      writeFileSync(path, content, 'UTF-8');
    } catch (error) {
      console.error(error);
    }
  }
}

export default PathUtil;
