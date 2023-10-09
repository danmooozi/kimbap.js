class StringUtil {
    /**
     * trim function
     * @param {string} target 
     * 
     * @returns {string}
     */
    static trim(target) {
        const lines = target.split('\n').filter(Boolean);
        const padLength = lines[0].length - lines[0].trimLeft().length;
        const regex = new RegExp(`^\\s{${padLength}}`);

        return lines.map(line => line.replace(regex, '')).join('\n');
    }
}

export default StringUtil;