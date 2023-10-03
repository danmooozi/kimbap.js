import { transformFromAstSync } from '@babel/core';
import transformEsmToCjs from './transform-esm-to-cjs.js';
import transformStrictMode from './transform-strict-mode.js';
import { DEFAULT_OPTS, FORMAT } from './constants/index.js';

const getActualOpts = (opts) => Object.assign({}, DEFAULT_OPTS, opts);

const PLUGIN_MAP = {
  strictMode: {
    plugin: transformStrictMode,
    conditions: [],
  },
  esmToCjs: {
    plugin: transformEsmToCjs,
    conditions: [({ format }) => FORMAT[format] === FORMAT.CJS],
  },
};

const transform = (ast, content, opts) => {
  const { requireAst, requireCode, ...restOpts } = getActualOpts(opts);

  const { ast: transformedAst, code: transformedContent } =
    transformFromAstSync(ast, content, {
      ast: requireAst,
      code: requireCode,
      plugins: Object.entries(PLUGIN_MAP).map(
        ([_key, { plugin, conditions }]) =>
          conditions.every((func) => func(restOpts)) && plugin,
      ),
    });

  return {
    transformedAst,
    transformedContent,
  };
};

export default transform;
