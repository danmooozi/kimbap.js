import { transformFromAstSync } from '@babel/core';
import transformEsmToCjs from './transform-esm-to-cjs.js';
import transformStrictMode from './transform-strict-mode.js';
import { DEFAULT_OPTIONS } from './constants/index.js';

const getActualOptions = (options) =>
  Object.assign({}, DEFAULT_OPTIONS, options);

const PLUGIN_MAP = {
  strictMode: {
    plugin: transformStrictMode,
    conditions: [],
  },
  esmToCjs: {
    plugin: transformEsmToCjs,
    conditions: [],
  },
};

const transform = (ast, content, options) => {
  const { requireAst, requireCode, ...restOptions } = getActualOptions(options);

  const { ast: transformedAst, code: transformedContent } =
    transformFromAstSync(ast, content, {
      ast: requireAst,
      code: requireCode,
      plugins: Object.values(PLUGIN_MAP).map(
        ({ plugin, conditions }) =>
          conditions.every((func) => func(restOptions)) && plugin,
      ),
    });

  return {
    transformedAst,
    transformedContent,
  };
};

export default transform;
