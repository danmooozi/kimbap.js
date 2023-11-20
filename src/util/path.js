import {
  existsSync,
  lstatSync,
  readFileSync,
} from 'fs';

import { join, relative } from 'path';

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

  // 해당 경로가 디렉토리인지를 판별하는 함수 isDirectory
  static isDirectory(path) {
    return existsSync(path) && lstatSync(path).isDirectory();
  }

  // 해당 경로가 파일인지를 판별하는 함수 isFile
  static isFile(path) {
    return existsSync(path) && lstatSync(path).isFile();
  }

  // 특정 경로에 위치한 파일의 Content 를 가져오는 함수 getContentInPath
  static getContentInPath(path) {
    return readFileSync(path, 'UTF-8');
  }

  /**
   * join paths
   * @param {string[]} paths 
   * 
   * @returns {string}
   */
  static join(paths) {
    return join(...paths);
  }

  /** 
   * get relative path 
   * @param {string} from
   * @param {string} to
   * 
   * @returns {string}
  */
  static relative(from, to) {
    return relative(from, to);
  }
}

export default PathUtil;
