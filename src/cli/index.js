import Queue from '../util/queue.js';
import { OPTION, DEFAULT_OPTIONS } from './constant.js';

/**
 * @typedef {object} options - 옵션 객체
 * @property {boolean} sourceMap - sourcemap 옵션
 */

/**
 * 각종 옵션 생성
 * @returns {Object} options
 */

const CommandLineInterface = () => {
  const buildOptions = DEFAULT_OPTIONS;
  const buildQueue = new Queue(process.argv.slice(2));

  while (buildQueue.size()) {
    // flag 인지 source 인지 구분
    const currentOption = buildQueue.dequeue();
    if (currentOption.startsWith('-')) {
      const requireSource = [];
      const { function: optionFunction, requireSource: requireSourceCount } =
        OPTION[currentOption];

      for (let i = 0; i < requireSourceCount; i++) {
        if (!buildQueue.size()) {
          throw new Error('Invalid option');
        }
        requireSource.push(buildQueue.dequeue());
      }

      optionFunction(...requireSource, buildOptions);
    } else {
      throw new Error('Invalid option');
    }
  }

  return buildOptions;
};

export default CommandLineInterface;
