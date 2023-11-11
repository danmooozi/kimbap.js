import { types as t } from '@babel/core';

const visitor = {
  Program: programVisitor,
};

function programVisitor(path, _state) {
  const {
    node: { directives },
  } = path;

  /*
   * 'use strict' 가 존재하는 경우
   * 따로 노드를 업데이트하지 않는다.
   */
  for (const directive of directives) {
    if (directive.value.value === 'use strict') return;
  }

  /*
   * 'use strict' 가 존재하지 않는 경우
   * use strict' 노드를 추가한다.
   */
  path.unshiftContainer(
    'directives',
    t.directive(t.directiveLiteral('use strict')),
  );
}

export default () => ({
  name: '@kimbap/transform-strict-mode',
  visitor,
});
