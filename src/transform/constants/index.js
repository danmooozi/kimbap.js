export const FORMAT = {
  ESM: 'esm',
  CJS: 'cjs',
};

export const DEFAULT_OPTIONS = {
  requireCode: true,
  requireAst: false,
  format: FORMAT.CJS,
};

export const DEFAULT_IMPORT_KEYWORD = 'default';

// aliases
Object.assign(FORMAT, {
  esm: FORMAT.ESM,
  es: FORMAT.ESM,
  cjs: FORMAT.CJS,
  cj: FORMAT.CJS,
});
