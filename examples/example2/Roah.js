import { Person } from "./Person.js";

export class Roah extends Person {
    constructor(name, age, job) {
        super(name, age, job);
    }

    ate(food) {
        console.log(`============== yammy ! ==============`);
        console.log(`Roah ate ${food}`);
    }
}