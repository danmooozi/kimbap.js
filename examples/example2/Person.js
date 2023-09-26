export class Person {
    constructor(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
    }

    introduction() {
        console.log(`Hello! My name is ${this.name}`);
        console.log(`I'm ${this.age} years old`);
        console.log(`My job is ${this.job}`);
    }
}