export const isArray = (val) => Array.isArray(val);

export const isObject = (val) =>
  val !== null && typeof val === 'object' && !isArray(val);
