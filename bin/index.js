#!/usr/bin/env node

import CLI from '../src/cli/index.js';
import Bundler from '../src/index.js';

async function main() {
  try {
    const bundlerOptions = CLI();
    const bundler = new Bundler(bundlerOptions);

    bundler.build();
  } catch (error) {
    console.log(error);
  }
}
main();
