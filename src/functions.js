import { concat } from "./utils.js";
import { COUNTRY, NAME } from "./constants.js";

export function myFunction() {
  return "this is my function";
}

export function secondaryFunction() {
  return {
    name: NAME,
    id: 123,
  };
}

export function anotherFunction() {
  return concat(NAME, COUNTRY);
}
