const { secondaryFunction } = require("./functions.js");
const { NAME } = require("./constants.js");

function concat(a, b) {
  return [a, b].join(" ");
}

module.exports = {
  concat,
};
