import { parseSync } from "@babel/core";
import { readFileSync } from "fs";
import path from "path";

/**
 * 주어진 파일에서 문자열을 읽어 반환
 * @param {string} filename - 읽을 파일의 이름.
 * @returns {string|null} 파일의 내용 또는 오류가 발생한 경우 null.
 */
const readFile = (filename) => {
  try {
    const data = readFileSync(filename, "utf-8");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * 주어진 파일을 bable/parse로 AST를 반환
 * @function
 * @param {string} filename - 분석할 파일의 이름.
 * @returns {Object}
 */
const parseFile = (filename) => {
  const absolutePath = path.resolve(filename);
  const code = readFile(absolutePath);

  if (code === null) {
    throw new Error(`Cannot read file ${filename}`);
  }

  const ast = parseSync(code, { filename: absolutePath });

  return ast;
};

/**
 * CLI 분석용 함수
 * @returns {Object} 옵션과 파일 경로 객체
 */
const inputInterface = () => {
  const [, , ...args] = process.argv;

  if (args.length === 2) {
    return { option: args[0], filePath: args[1] };
  }

  if (args.length === 1) {
    return { filePath: args[0] };
  }
};

/**
 * 파일을 읽어 AST를 반환
 * @returns {Object} AST
 */
const fileInput = () => {
  const { option, filePath } = inputInterface();
  const ast = parseFile(filePath);

  if (option) {
    // TO DO : option 처리
  }
  return ast;
};

export default fileInput;
