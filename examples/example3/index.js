import _ from 'lodash';

const danmoozi = [
    {
        name: 'mono',
        age: 20,
        job: 'developer',
    },
    {
        name: 'irang',
        age: 19,
        job: 'student',
    },
    {
        name: 'rookie',
        age: 22,
        job: 'dancer',
    },
    {
        name: 'roah',
        age: 25,
        job: 'singer',
    }
];

function findIndexByAge(array, age) {
    return _.findIndex(array, function(obj) {
        return obj.age === age;
    });
}

function removeByJob(array, job) {
    _.remove(array, function(obj) {
        return obj.job === job;
    });
}

(function () {
    const index = findIndexByAge(danmoozi, 25);
    console.log(`${danmoozi[index].name} is 25 years old`);
    
    removeByJob(danmoozi, 'student');
    console.log(danmoozi);
})();