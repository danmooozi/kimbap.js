import { parseSync } from '@babel/core';
import transform from '../../index.js';

const contentToAST = (content) => parseSync(content);

export const format = (strings) => {
  const source = strings.join('').trim();
  const lines = source.split('\n');

  if (lines.length === 1) {
    return source;
  }

  const space = lines[lines.length - 1].match(/\s+/)[0];
  const exp = new RegExp(`${space}`, 'g');

  return source.replace(exp, '');
};

export const contentToTransformedContent = (content) => {
  const ast = contentToAST(content);
  const { transformedContent } = transform(ast, content);

  return transformedContent;
};
