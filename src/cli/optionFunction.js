import fs from 'fs';
import { resolve } from 'path';
import PathUtil from '../util/path.js';

const setEntryPath = (path, options) => {
  if (!path) {
    throw new Error('entry path가 존재하지 않습니다.');
  }

  if (!options) {
    throw new Error('options가 존재하지 않습니다.');
  }
  const absolutePath = resolve(path);
  options.entry = absolutePath;
};

const setOutputPath = (path, options) => {
  if (!path) {
    throw new Error('output path가 존재하지 않습니다.');
  }

  if (!options) {
    throw new Error('options가 존재하지 않습니다.');
  }
  const absolutePath = resolve(path);

  // 만약에 path 에 dir이 없으면 생성
  if (!PathUtil.isDirectory(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }

  options.output.path = absolutePath;
};

const setOutputFileName = (fileName, options) => {
  if (!fileName) {
    throw new Error('output file name이 존재하지 않습니다.');
  }

  if (!options) {
    throw new Error('options가 존재하지 않습니다.');
  }
  options.output.fileName = fileName;
};

const setSourceMap = (options) => {
  if (!options) {
    throw new Error('options가 존재하지 않습니다.');
  }
  options.sourceMap = true;
};

export { setOutputPath, setOutputFileName, setEntryPath, setSourceMap };
