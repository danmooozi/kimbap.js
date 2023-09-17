import fs from 'fs';
import { fileURLToPath } from "url";
import path from 'path';
import { createDependencyGraph } from './core/dependency.js';
import { bundle } from './core/bundle.js';
import { makeDirectory } from './utils/file.js';

/**
 * 파일 시작점 부터 dependency 그래프를 만들고, 번들링하여 최종 김밥 파일을 생성하는 함수
 * @param {object} params
 * @param {string} params.entryFile
 * @param {string} params.outputFolder
 */
function rollKimbap({ entryFile, outputFolder }) {
    // step 1 : entryFile 을 루트로 하는 dependency 그래프 생성
    const graph = createDependencyGraph(entryFile);

    // step 2 : dependency 그래프를 통해 번들링
    const outputFiles = bundle(graph);

    // step 3 : output 파일 작성
    for (const outputFile of outputFiles) {
        fs.writeFileSync(
            path.join(makeDirectory(outputFolder), outputFile.name),
            outputFile.content,
            'utf-8'
        );
    }
}

// es6 에서 __dirname 대신 사용
const __dirname = fileURLToPath(new URL(".", import.meta.url));

rollKimbap({
    entryFile: path.join(__dirname, '../example/index.js'),
    outputFolder: path.join(__dirname, '../dist'),
});