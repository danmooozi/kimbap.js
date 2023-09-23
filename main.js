const { writeFileSync, existsSync, mkdirSync } = require("fs");
const { dirname, join } = require("path");
const { parseSync } = require("@babel/core");
const { transform } = require("./transform");

const contentToAST = (content) => parseSync(content);

const writeFile = (filepath, data) => {
  try {
    const dir = dirname(filepath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filepath, data, "UTF-8");
  } catch (err) {
    console.log(err);
  }
};

(() => {
  const output = {
    path: join(__dirname, "./dist"),
    filename: "result.js",
  };

  const content = `
    // case 1:
    import square from './square';
    console.log("Area of square: ", square(3, 5));

    // case 2:
    import {a, b} from './square';
    console.log("Area of square: ", a(3, 5));
  `;
  const ast = contentToAST(content);
  const { transformedAst, transformedContent } = transform(ast, content);

  writeFile(join(output.path, output.filename), transformedContent);
})();

module.exports = {
  contentToAST,
};
