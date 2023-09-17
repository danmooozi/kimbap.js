import fs from 'fs';
import babel from '@babel/core';
import { createModule } from './dependency.js';
import { resolveRequest } from '../utils/file.js';
import { getASTtransformOptions } from '../utils/ast.js';

/**
 * 파일에 대한 정보를 담고 있는 Module 인스턴스 
 * @class
 * @typedef {Object} Module
 * @property {string} filePath
 * @property {string} content
 * @property {object} ast
 * @property {object[]} dependencies
 */
export class Module {
    constructor(filePath) {
        this.filePath = filePath;
        this.content = fs.readFileSync(filePath, 'utf-8');
        this.ast = babel.parseSync(this.content);
    }

    initDependencies() {
        this.dependencies = this.findDependencies();
    }

    findDependencies() {
        return this.ast.program.body
            .filter(node => node.type === 'ImportDeclaration')
            .map(node => node.source.value)
            .map(relativePath => resolveRequest(this.filePath, relativePath))
            .map(absolutePath => createModule(absolutePath));
    }

    transformModuleInterface() {
        const { types: t } = babel;

        const { ast, code } = babel.transformFromAstSync(this.ast, this.content, {
            ast: true,
            plugins: [getASTtransformOptions(this.filePath, t)],
        });

        this.ast = ast;
        this.content = code;
    }
}