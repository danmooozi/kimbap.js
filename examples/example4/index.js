const { findIndexByAge, removeByJob } = require('./util');
const { danmoozi } = require('./constant');

(function () {
    const index = findIndexByAge(danmoozi, 25);
    console.log(`${danmoozi[index].name} is 25 years old`);

    removeByJob(danmoozi, 'student');
    console.log(danmoozi);
})();