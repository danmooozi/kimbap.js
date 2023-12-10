import { parseSync } from '@babel/core';
import transform from '../../index.js';

const contentToAST = (content) => parseSync(content);

const getReplacementMap = (lines, values) => {
  const replacements = new Map();
  const usedValues = values;

  lines.forEach((line) => {
    const match = line.match(/\${(.*?)}/);
    if (match) {
      const placeholder = match[0];
      const value = usedValues.shift();
      replacements.set(placeholder, value);
    }
  });

  return replacements;
};

const replacePlaceholderToValue = (source, replacements) => {
  let replacedSource = source;

  for (const [placeholder, value] of replacements) {
    replacedSource = replacedSource.replace(placeholder, value);
  }

  return replacedSource;
};

export const format = (strings, ...values) => {
  const source = String.raw(strings, ...values).trim();
  const lines = source.split('\n');

  if (lines.length === 1) return source;

  const space = lines[lines.length - 1].match(/\s+/)[0];
  const exp = new RegExp(`${space}`, 'g');

  const replacements = getReplacementMap(lines, values);
  const replacedSource = replacePlaceholderToValue(source, replacements);

  return replacedSource.replace(exp, '');
};

export const contentToTransformedContent = (content) => {
  const ast = contentToAST(content);
  const { transformedContent } = transform(ast, content);

  return transformedContent;
};
