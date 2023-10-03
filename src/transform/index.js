import { transformFromAstSync } from '@babel/core';
import transformEsmToCjs from './transform-esm-to-cjs.js';
import transformStrictMode from './transform-strict-mode.js';

const DEFAULT_OPTIONS = {
  requireCode: true,
  requireAst: false,
};

const transform = (ast, content, options = DEFAULT_OPTIONS) => {
  const { requireAst, requireCode } = options;

  const { ast: transformedAst, code: transformedContent } =
    transformFromAstSync(ast, content, {
      ast: requireAst,
      code: requireCode,
      plugins: [transformStrictMode, transformEsmToCjs],
    });

  return {
    transformedAst,
    transformedContent,
  };
};

export default transform;
