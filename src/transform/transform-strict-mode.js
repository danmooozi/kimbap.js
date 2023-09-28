import { types as t } from '@babel/core';

const visitor = {
  Program: programVisitor,
};

function programVisitor(path, state) {
  const {
    node: { directives },
  } = path;

  for (const directive of directives) {
    if (directive.value.value === 'use strict') return;
  }

  path.unshiftContainer(
    'directives',
    t.directive(t.directiveLiteral('use strict')),
  );
}

export default () => ({
  name: '@kimbap/transform-strict-mode',
  visitor,
});
