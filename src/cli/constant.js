import {
  setOutputPath,
  setEntryPath,
  setOutputFileName,
  setSourceMap,
} from './optionFunction.js';
import { resolve } from 'path';

const HELP_MESSAGE = `
    Usage: kimbap [options] <source ...>

    Options:
        -e, --entry <path>    Entry file path
        -s, --sourcemaps      Output with sourcemaps
        -o, --output <path>   Output file path
        -d, --dist <filename> Output file name
        -h, --help            Output usage information
`;

const DEFAULT_OPTIONS = {
  entry: resolve('./index.js'),
  output: {
    path: '/dist',
    filename: 'bundle.js',
  },
  option: {
    sourceMap: false,
  },
};

const getHelpMessage = () => {
  console.log(HELP_MESSAGE);
};

const entryOption = {
  function: setEntryPath,
  requireSource: 1,
};

const setOutputOption = {
  function: setOutputPath,
  requireSource: 1,
};

const setOutputFileNameOption = {
  function: setOutputFileName,
  requireSource: 1,
};

const getHelpMessageOption = {
  function: getHelpMessage,
  requireSource: 0,
};

const setSourceMapOption = {
  function: setSourceMap,
  requireSource: 0,
};

const OPTION = {
  '-e': entryOption,
  '--entry': entryOption,
  '-o': setOutputOption,
  '--output': setOutputOption,
  '-d': setOutputFileNameOption,
  '--dist': setOutputFileNameOption,
  '-h': getHelpMessageOption,
  '--help': getHelpMessageOption,
  '-s': setSourceMapOption,
  '--sourcemaps': setSourceMapOption,
};

export { OPTION, DEFAULT_OPTIONS };
