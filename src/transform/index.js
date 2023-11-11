import { transformFromAstSync } from '@babel/core';
import { DEFAULT_OPTIONS, PLUGIN_MAP } from './constants/index.js';

const getActualOptions = (options) =>
  Object.assign({}, DEFAULT_OPTIONS, options);

const transform = (ast, content, options) => {
  const { requireAst, requireCode, ...restOptions } = getActualOptions(options);

  /*
   * babel.transformFromAstSync
   * 변환 단계에서는 추상 구문 트리(AST)를 받아 그 속을 탐색해 나가며 노드들을 추가, 업데이트, 제거
   * {@link https://babeljs.io/docs/babel-core#transformfromastsync}
   */
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
