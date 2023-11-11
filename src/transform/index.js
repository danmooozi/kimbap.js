import { transformFromAstSync } from '@babel/core';
import { DEFAULT_OPTIONS, PLUGIN_MAP } from './constants/index.js';

const getActualOptions = (options) =>
  Object.assign({}, DEFAULT_OPTIONS, options);

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
