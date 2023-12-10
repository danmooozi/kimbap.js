import { types as t, template } from '@babel/core';
import { DEFAULT_IMPORT_KEYWORD } from './constants/index.js';
import { isArray } from '../util/assertion.js';

const getModuleExportsAssignment = (
  value,
  property = DEFAULT_IMPORT_KEYWORD,
) => {
  const moduleTemplate = template(`module.exports.PROPERTY = MODULE;`);

  const newNode = moduleTemplate({
    PROPERTY: property,
    MODULE: value,
  });

  return newNode;
};

const kimbapVisitor = {
  ImportDeclaration: importDeclarationVisitor,
  ExportDefaultDeclaration: exportDefaultDeclarationVisitor,
  ExportNamedDeclaration: exportNamedDeclarationVisitor,
};

/*
 * AST 변환을 하고 싶을때, 재귀적으로 트리를 탐색해야 한다.
 * AST는 단일 노드 또는 수백개, 수천개의 노드로 이루어 질 수 있으며 각 노드들을 탐색하는 동안 막다른 곳에 다다르는데
 * 이때, 다음 노드로 가기위해서는 뒤로 돌아가는 것이 필요하기 때문에 각 노드에 입장(enter)하고, 돌아올때 각 노드를 퇴장(exit)하면서 두번의 방문을 거치게 된다.
 */
const visitor = {
  Program: {
    enter(programPath, state) {
      programPath.traverse(kimbapVisitor, state);
    },
    exit(programPath, state) {
      programPath.traverse(kimbapVisitor, state);
    },
  },
};

function importDeclarationVisitor(path) {
  /*
   * 로컬로 정의된 변수와 충돌하지 않는 식별자 생성
   * Node { type: "Identifier", name: "_imported" }
   */
  const newIdentifier = path.scope.generateUidIdentifier('imported');

  const specifiers = path.get('specifiers');

  if (!isArray(specifiers)) return;

  specifiers.forEach((specifier) => {
    /*
     * import specifier from "library" 의 경우
     * specifier에 대한 바인딩 목록들을 가져온다.
     */
    const { referencePaths } = specifier.scope.getBinding(
      specifier.node.local.name,
    );

    /*
     * a라는 importedKey에 접근하기 위해서는 두 가지의 경우가 존재
     * default export 의 형태인 경우 import a from "source"
     * 아닌 경우 import { a } from "source"
     */
    const importedKey = specifier.isImportDefaultSpecifier()
      ? DEFAULT_IMPORT_KEYWORD
      : specifier.get('imported.name').node;

    /*
     * 바인딩 목록들을 순회하며 노드를 업데이트 한다.
     * specifier(1, 2)를 newIdentifier[`importedKey`](1, 2) 형태로 업데이트 한다.
     */
    referencePaths.forEach((refPath) => {
      /*
       * If computed === true, `object[property]`.
       * Else, `object.property` -- meaning property should be an Identifier.
       */
      refPath.replaceWith(
        t.memberExpression(newIdentifier, t.stringLiteral(importedKey), true),
      );
    });
  });

  const buildRequire = template(`const IMPORT_NAME = require(SOURCE);`);

  const newNode = buildRequire({
    IMPORT_NAME: newIdentifier,
    SOURCE: t.stringLiteral(path.get('source.value').node),
  });

  /*
   * import문을 require문으로  업데이트 한다.
   * const newIdentifier = require(`path.get("source.value").node`);
   */
  path.replaceWith(newNode);
}

function exportDefaultDeclarationVisitor(path) {
  const declaration = path.get('declaration');

  /*
   * 함수선언문인 경우
   * module.exports = test;
   * function test(){...}
   */
  if (declaration.isFunctionDeclaration()) {
    path.replaceWithMultiple([
      getModuleExportsAssignment(t.identifier(declaration.node.id.name)),
      declaration.node,
    ]);
    return;
  }

  /*
   * module.exports = test;
   * export문을 module.exports문으로 업데이트 한다.
   */
  path.replaceWith(
    getModuleExportsAssignment(t.identifier(declaration.node.name)),
  );
}

function exportNamedDeclarationVisitor(path) {
  const declarations = [];

  if (path.has('declaration')) {
    const declaration = path.get('declaration');

    /*
     * 클래스선언문인 경우
     * export class A {};
     */
    if (declaration.isClassDeclaration()) {
      declarations.push({
        name: declaration.node.id,
        value: t.toExpression(declaration.node),
      });
    }

    /*
     * 함수선언문인 경우
     * export function func(){};
     */
    if (declaration.isFunctionDeclaration()) {
      declarations.push({
        name: declaration.node.id,
        value: t.toExpression(declaration.node),
      });
    }

    /*
     * 변수선언문인 경우
     * export const foo = 'a';
     * export const foo = 'a', bar = 'b';
     */
    if (declaration.isVariableDeclaration()) {
      const decls = declaration.get('declarations');

      decls.forEach((decl) => {
        declarations.push({
          name: decl.get('id').node,
          value: decl.get('init').node,
        });
      });
    }
  }

  /*
   * Export list인 경우
   * export { name1, …, nameN };
   */
  if (path.has('specifiers')) {
    const specifiers = path.get('specifiers');

    specifiers.forEach((specifier) => {
      declarations.push({
        name: specifier.get('exported').node,
        value: specifier.get('local').node,
      });
    });
  }

  /*
   * module.exports.[property] = value;
   * export문을 module.exports문으로 업데이트 한다.
   */
  path.replaceWithMultiple(
    declarations.map((decl) =>
      getModuleExportsAssignment(decl.value, decl.name),
    ),
  );
}

export default () => ({
  name: '@kimbap/transform-esm-to-cjs',
  visitor,
});
