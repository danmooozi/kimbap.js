const { transform } = require("./");
const { contentToAST } = require("../main");

const format = (strings) => {
  const source = strings.join("").trim();
  const lines = source.split("\n");

  if (lines.length === 1) {
    return source;
  }

  const space = lines[lines.length - 1].match(/\s+/)[0];
  const exp = new RegExp(`${space}`, "g");

  return source.replace(exp, "");
};

describe("import declaration", () => {
  it("can support Default import", () => {
    const content = `
      import square from './square';
      console.log("Area of square: ", square(3, 5));
    `;

    const expectedTransformedCode = format`
      const _imported = require("./square");
      console.log("Area of square: ", _imported["default"](3, 5));
    `;

    const ast = contentToAST(content);
    const { transformedContent } = transform(ast, content);

    expect(transformedContent).toBe(expectedTransformedCode);
  });

  it("can support Named import", () => {
    const content = `
      import { a } from './square';
      console.log("Area of square: ", a(3, 5));
    `;

    const expectedTransformedCode = format`
      const _imported = require("./square");
      console.log("Area of square: ", _imported["a"](3, 5));
    `;

    const ast = contentToAST(content);
    const { transformedContent } = transform(ast, content);

    expect(transformedContent).toBe(expectedTransformedCode);
  });
});
