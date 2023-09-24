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
      module.exports.default = test;
      function test(user) {
        console.log(user);
      }
      ;
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent
    );
  });

  it("can support Variable Declarations", () => {
    const content = `
      const test = 'test';
      export default test;
    `;

    const expectedTransformedContent = format`
      const test = 'test';
      module.exports.default = test;
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent
    );
  });
});

describe("ExportNamedDeclaration", () => {
  it("can support function Declaration", () => {
    const content = `
      export function functionName() {}
    `;

    const expectedTransformedContent = format`
      module.exports.functionName = function functionName() {};
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent
    );
  });

  it("can support Variable Declarations", () => {
    const content = `
      export const foo = 'a', bar = 'b';
    `;

    const expectedTransformedContent = format`
      module.exports.foo = 'a';
      module.exports.bar = 'b';
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent
    );
  });

  it("can support export list", () => {
    const content = `
      const name1 = 'a';
      const name2 = 'b';
      export { name1, name2 };
    `;

    const expectedTransformedContent = format`
      const name1 = 'a';
      const name2 = 'b';
      module.exports.name1 = name1;
      module.exports.name2 = name2;
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent
    );
  });
});
