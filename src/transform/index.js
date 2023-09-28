import { transformFromAstSync } from '@babel/core';
import transformEsmToCjs from './transform-esm-to-cjs.js';
import transformStrictMode from './transform-strict-mode.js';

const DEFAULT_OPTS = {
  requireCode: true,
  requireAst: false,
};

const transform = (ast, content, opts = DEFAULT_OPTS) => {
  const { requireAst, requireCode } = opts;

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
