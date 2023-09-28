import { template } from '@babel/core';

export const isArray = (val) => Array.isArray(val);

export const isObject = (val) =>
  val !== null && typeof val === 'object' && !isArray(val);

export const getModuleExportsAssignment = (value, property = 'default') => {
  const moduleTemplate = template(`module.exports.PROPERTY = MODULE;`);

  const newNode = moduleTemplate({
    PROPERTY: property,
    MODULE: value,
  });

  return newNode;
};
