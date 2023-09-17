const { concat } = require("./utils.js");
const { COUNTRY, NAME } = require("./constants.js");

function myFunction() {
  return "this is my function";
}

function secondaryFunction() {
  return {
    name: NAME,
    id: 123,
  };
}

function anotherFunction() {
  return concat(NAME, COUNTRY);
}

module.exports = {
  myFunction,
  secondaryFunction,
  anotherFunction,
};
