import { transformFromAstSync } from '@babel/core';
import transformEsmToCjs from './transform-esm-to-cjs.js';
import transformStrictMode from './transform-strict-mode.js';

const transform = (ast, content) => {
  const { ast: transformedAst, code: transformedContent } =
    transformFromAstSync(ast, content, {
      plugins: [transformStrictMode, transformEsmToCjs],
    });

  return {
    transformedAst,
    transformedContent,
  };
};

export default transform;
