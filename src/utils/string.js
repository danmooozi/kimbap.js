/**
 * 문자열 trim 함수
 * @param {string} target 
 * 
 * @returns {string}
 */
export function trim(target) {
    const lines = target.split('\n').filter(Boolean);
    const padLength = lines[0].length - lines[0].trimLeft().length;
    const regex = new RegExp(`^\\s{${padLength}}`);
    return lines.map(line => line.replace(regex, '')).join('\n');
}