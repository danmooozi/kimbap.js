const _ = require('lodash');
const { danmoozi } = require('./constant');

function findIndexByAge(array, age) {
    return _.findIndex(array, function (obj) {
        return obj.age === age;
    });
}

function removeByJob(array, job) {
    _.remove(array, function (obj) {
        return obj.job === job;
    });
}

module.exports = {
    findIndexByAge,
    removeByJob,
}