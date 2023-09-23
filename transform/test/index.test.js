const { format, contentToTransformedContent } = require("./utils");

describe("import declaration", () => {
  it("can support Default import", () => {
    const content = `
      import square from './square';
      console.log("Area of square: ", square(3, 5));
    `;

    const expectedTransformedContent = format`
      const _imported = require("./square");
      console.log("Area of square: ", _imported["default"](3, 5));
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent
    );
  });

  it("can support Named import", () => {
    const content = `
      import { a } from './square';
      console.log("Area of square: ", a(3, 5));
    `;

    const expectedTransformedContent = format`
      const _imported = require("./square");
      console.log("Area of square: ", _imported["a"](3, 5));
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent
    );
  });
});

describe("ExportDefaultDeclaration", () => {
  it("can support function Declaration", () => {
    const content = `
      export default function test(user) {
        console.log(user);
      };
    `;

    const expectedTransformedContent = format`
      module.exports = test;
      function test(user) {
        console.log(user);
      }
      ;
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent
    );
  });
});
