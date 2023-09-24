/* 
    1. package.json 병합
    2. .gitignore 병합
    3. README.md 병합
    4. LICENSE 병합
    5. .prettierrc 병합
*/
/*
    1. alias 도 잘 읽어 올 수 있는가?
    2. 지금 결과물로도 parsing 이 가능한가?

*/
import { parseSync } from "@babel/core";
import { readFileSync } from "fs";
import path from "path";

const readFile = (filename) => {
  try {
    const data = readFileSync(filename, "utf-8");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const parseFile = (filename) => {
  try {
    const absolutePath = path.resolve(filename);
    const code = readFile(absolutePath);

    if (code === null) {
      throw new Error(`Cannot read file ${filename}`);
    }

    const ast = parseSync(code, { filename: absolutePath });

    return ast;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const inputInterface = () => {
  const [, , ...args] = process.argv;

  if (args.length === 2) {
    return { option: args[0], filePath: args[1] };
  }

  if (args.length === 1) {
    return { filePath: args[0] };
  }
};

const fileInput = () => {
  const { option, filePath } = inputInterface();
  const ast = parseFile(filePath);

  if (option) {
    // TO DO : option 처리
  }
  return ast;
};

fileInput();
export default fileInput;
