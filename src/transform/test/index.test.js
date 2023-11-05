import { format, contentToTransformedContent } from './utils';
import { DEFAULT_IMPORT_KEYWORD } from '../constants';

describe('import declaration', () => {
  it('can support Default import', () => {
    const content = `
      import square from './square';
      console.log("Area of square: ", square(3, 5));
    `;

    const expectedTransformedContent = format`
      "use strict";

      const _imported = require("./square");
      console.log("Area of square: ", _imported["${DEFAULT_IMPORT_KEYWORD}"](3, 5));
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent,
    );
  });

  it('can support Named import', () => {
    const content = `
      import { a } from './square';
      console.log("Area of square: ", a(3, 5));
    `;

    const expectedTransformedContent = format`
      "use strict";

      const _imported = require("./square");
      console.log("Area of square: ", _imported["a"](3, 5));
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent,
    );
  });
});

describe('ExportDefaultDeclaration', () => {
  it('can support function Declaration', () => {
    const content = `
      export default function test(user) {
        console.log(user);
      };
    `;

    const expectedTransformedContent = format`
      "use strict";

      module.exports.${DEFAULT_IMPORT_KEYWORD} = test;
      function test(user) {
        console.log(user);
      }
      ;
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent,
    );
  });

  it('can support Variable Declarations', () => {
    const content = `
      const test = 'test';
      export default test;
    `;

    const expectedTransformedContent = format`
      "use strict";

      const test = 'test';
      module.exports.${DEFAULT_IMPORT_KEYWORD} = test;
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent,
    );
  });
});

describe('ExportNamedDeclaration', () => {
  it('can support function Declaration', () => {
    const content = `
      export function functionName() {}
    `;

    const expectedTransformedContent = format`
      "use strict";

      module.exports.functionName = function functionName() {};
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent,
    );
  });

  it('can support Variable Declarations', () => {
    const content = `
      export const foo = 'a', bar = 'b';
    `;

    const expectedTransformedContent = format`
      "use strict";

      module.exports.foo = 'a';
      module.exports.bar = 'b';
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent,
    );
  });

  it('can support export list', () => {
    const content = `
      const name1 = 'a';
      const name2 = 'b';
      export { name1, name2 };
    `;

    const expectedTransformedContent = format`
      "use strict";

      const name1 = 'a';
      const name2 = 'b';
      module.exports.name1 = name1;
      module.exports.name2 = name2;
    `;

    expect(contentToTransformedContent(content)).toBe(
      expectedTransformedContent,
    );
  });
});
