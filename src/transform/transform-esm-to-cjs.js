import { types as t, template } from '@babel/core';
import { isArray } from '../util/assertion.js';

const getModuleExportsAssignment = (value, property = 'default') => {
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
  const newIdentifier = path.scope.generateUidIdentifier('imported');
  const specifiers = path.get('specifiers');

  if (!isArray(specifiers)) return;

  specifiers.forEach((specifier) => {
    // import square from "./square";의 경우
    // square에 해당하는 이름의 바인딩 목록들을 가져온다.
    const { referencePaths } = specifier.scope.getBinding(
      specifier.node.local.name,
    );

    // a라는 importedKey에 접근하기 위해서는 두 가지의 경우가 존재
    // default export 의 형태인 경우 import a from "source"
    // 아닌 경우 import { a } from "source"
    const importedKey = specifier.isImportDefaultSpecifier()
      ? 'default'
      : specifier.get('imported.name').node;

    // convert console.log(square(1, 2)) to console.log(newIdentifier[`importedKey`](1, 2))
    referencePaths.forEach((refPath) => {
      // If computed === true, `object[property]`.
      // Else, `object.property` -- meaning property should be an Identifier.
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

  // const newIdentifier = require(`path.get("source.value").node`);
  path.replaceWith(newNode);
}

function exportDefaultDeclarationVisitor(path) {
  const declaration = path.get('declaration');

  // 함수선언문인 경우
  if (declaration.isFunctionDeclaration()) {
    // module.exports = test;
    // function test(){...}
    path.replaceWithMultiple([
      getModuleExportsAssignment(t.identifier(declaration.node.id.name)),
      declaration.node,
    ]);
    return;
  }

  // 나머지인 경우
  // module.exports = test;
  path.replaceWith(
    getModuleExportsAssignment(t.identifier(declaration.node.name)),
  );
}

function exportNamedDeclarationVisitor(path) {
  const declarations = [];

  // Exporting declarations
  if (path.has('declaration')) {
    const declaration = path.get('declaration');

    if (declaration.isFunctionDeclaration()) {
      declarations.push({
        name: declaration.node.id,
        value: t.toExpression(declaration.node),
      });
    }

    if (declaration.isVariableDeclaration()) {
      // export const foo = 'a';
      // export const foo = 'a', bar = 'b';
      const decls = declaration.get('declarations');

      decls.forEach((decl) => {
        declarations.push({
          name: decl.get('id').node,
          value: decl.get('init').node,
        });
      });
    }
  }

  // Export list
  if (path.has('specifiers')) {
    const specifiers = path.get('specifiers');

    specifiers.forEach((specifier) => {
      declarations.push({
        name: specifier.get('exported').node,
        value: specifier.get('local').node,
      });
    });
  }

  // module.exports.[property] = value;
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
