import transformStrictMode from '../transform-strict-mode.js';
import transformEsmToCjs from '../transform-esm-to-cjs.js';

export const DEFAULT_OPTIONS = {
  requireCode: true,
  requireAst: false,
};

export const DEFAULT_IMPORT_KEYWORD = '_default';

export const PLUGIN_MAP = {
  strictMode: {
    plugin: transformStrictMode,
    conditions: [],
  },
  esmToCjs: {
    plugin: transformEsmToCjs,
    conditions: [],
  },
};
