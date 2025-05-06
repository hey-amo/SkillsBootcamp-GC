// 06 May 25 - Day 01 Skills Boot camp

// Variables
let age = 35;
let height = 120;
let total = age + height;

height += 20;

let message = "Hello" + " world";

console.log("Height = " + height);
console.log(total);
console.log(message);

// --

if (age > 18) {
    console.log("That's ok");
} else {
    console.log("Not allowed");
}

console.log("Age:"  + age);

//
const plans = "Saturday night"
if (plans.startsWith("Sat")) {
    console.log("Yes");
} else {
    console.log("No");
}

// indexOf example
const paragraph = "This is a dog, not a cat!";

const searchTerm = "dog";
const indexOfFirst = paragraph.indexOf(searchTerm);

console.log(`The index of the first "${searchTerm}" is ${indexOfFirst}`);



